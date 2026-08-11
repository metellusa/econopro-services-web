/**
 * Netlify Function: transactional email/SMS send.
 * Secrets: RESEND_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER,
 * NOTIFICATION_FROM_EMAIL, NOTIFICATIONS_MODE
 *
 * In development (NOTIFICATIONS_MODE=development), messages are logged only.
 */

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const mode = process.env.NOTIFICATIONS_MODE || "development";

    if (mode !== "production") {
      console.info("[netlify:notifications:dev]", payload);
      return json(200, {
        ok: true,
        provider: "console",
        providerRef: `netlify-console-${Date.now()}`,
      });
    }

    if (payload.channel === "email") {
      return json(200, await sendEmail(payload));
    }
    if (payload.channel === "sms") {
      return json(200, await sendSms(payload));
    }

    return json(400, { error: "Unknown channel" });
  } catch (error) {
    return json(500, { error: error.message || "Notification send failed" });
  }
}

async function sendEmail({ to, subject, body }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFICATION_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and NOTIFICATION_FROM_EMAIL are required in production");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: subject || "EconoPro Services update",
      text: body,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Resend API error");
  }

  return { ok: true, provider: "resend", providerRef: data.id };
}

async function sendSms({ to, body }) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) {
    throw new Error("Twilio credentials are required in production");
  }

  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const params = new URLSearchParams({
    To: to,
    From: from,
    Body: body,
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Twilio API error");
  }

  return { ok: true, provider: "twilio", providerRef: data.sid };
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
