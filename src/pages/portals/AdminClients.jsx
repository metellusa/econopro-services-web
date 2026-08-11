import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/ui/Container";
import Section from "../../components/ui/Section";
import Button from "../../components/ui/Button";
import { fieldClassName } from "../../components/ui/FormControls";
import { searchClients } from "../../lib/opsApi";
import { createClient, listProjects } from "../../lib/projectApi";
import { generateGuestLink, listGuestTokens, revokeGuestLink } from "../../lib/clientApi";
import { linkClientToUser } from "../../lib/backend";

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [term, setTerm] = useState("");
  const [selected, setSelected] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    preferred_contact_method: "email",
  });
  const [linkUserId, setLinkUserId] = useState("");

  async function reload(search = term) {
    const rows = await searchClients(search);
    setClients(rows);
  }

  useEffect(() => {
    reload().catch((err) => setError(err.message || "Unable to load clients."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function selectClient(client) {
    setSelected(client);
    setError("");
    try {
      const [projectRows, tokenRows] = await Promise.all([
        listProjects({ clientId: client.id, includeArchived: true }),
        listGuestTokens(client.id),
      ]);
      setProjects(projectRows);
      setTokens(tokenRows);
    } catch (err) {
      setError(err.message || "Unable to load client details.");
    }
  }

  return (
    <Section tone="cream">
      <Container className="space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
            Clients
          </p>
          <h1 className="mt-2 font-display text-display-md text-brand-navy">
            Client management
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-brand-muted">
            Guest and registered contacts share one client record. Link accounts
            without duplicating projects.
          </p>
        </div>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <input
              className={fieldClassName()}
              placeholder="Search name, email, phone"
              value={term}
              onChange={async (event) => {
                const value = event.target.value;
                setTerm(value);
                await reload(value);
              }}
            />

            <div className="rounded-section border border-brand-border bg-white p-4 shadow-card space-y-3">
              <h2 className="font-semibold text-brand-navy">Add guest client</h2>
              <input
                className={fieldClassName()}
                placeholder="Full name"
                value={form.full_name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, full_name: event.target.value }))
                }
              />
              <input
                className={fieldClassName()}
                placeholder="Email"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
              <input
                className={fieldClassName()}
                placeholder="Phone"
                value={form.phone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={async () => {
                  try {
                    const created = await createClient({
                      full_name: form.full_name.trim(),
                      email: form.email.trim() || null,
                      phone: form.phone.trim() || null,
                      preferred_contact_method: form.preferred_contact_method,
                      is_guest: true,
                      email_notifications_enabled: Boolean(form.email.trim()),
                      sms_notifications_enabled: Boolean(form.phone.trim()),
                    });
                    setForm({
                      full_name: "",
                      email: "",
                      phone: "",
                      preferred_contact_method: "email",
                    });
                    await reload();
                    await selectClient(created);
                  } catch (err) {
                    setError(err.message || "Unable to create client.");
                  }
                }}
              >
                Create client
              </Button>
            </div>

            <ul className="space-y-2">
              {clients.map((client) => (
                <li key={client.id}>
                  <button
                    type="button"
                    onClick={() => selectClient(client)}
                    className={[
                      "w-full rounded-2xl border px-4 py-3 text-left",
                      selected?.id === client.id
                        ? "border-brand-gold bg-white"
                        : "border-brand-border bg-white/80",
                    ].join(" ")}
                  >
                    <p className="font-semibold text-brand-navy">{client.full_name}</p>
                    <p className="text-xs text-brand-muted">
                      {client.is_guest ? "Guest" : "Registered"} ·{" "}
                      {client.email || client.phone || "No contact"}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-section border border-brand-border bg-white p-5 shadow-card">
            {!selected ? (
              <p className="text-sm text-brand-muted">Select a client to view details.</p>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl text-brand-navy">
                    {selected.full_name}
                  </h2>
                  <p className="mt-2 text-sm text-brand-muted">
                    {selected.is_guest ? "Guest client" : "Linked registered client"}
                  </p>
                  <p className="mt-3 text-sm text-brand-ink">
                    {selected.email || "No email"} · {selected.phone || "No phone"}
                  </p>
                  <p className="mt-2 text-xs text-brand-muted">
                    Email notifications {selected.email_notifications_enabled ? "on" : "off"} ·
                    SMS {selected.sms_notifications_enabled ? "on" : "off"} · Preferred{" "}
                    {selected.preferred_contact_method}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-brand-navy">Projects</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {projects.length === 0 ? (
                      <li className="text-brand-muted">No projects yet.</li>
                    ) : (
                      projects.map((project) => (
                        <li key={project.id}>
                          <Link
                            to={`/admin/projects/${project.id}`}
                            className="font-semibold text-brand-navy hover:text-brand-gold"
                          >
                            {project.title}
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-brand-navy">Guest links</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await generateGuestLink(selected.id, [], "Client portal access");
                      const tokenRows = await listGuestTokens(selected.id);
                      setTokens(tokenRows);
                    }}
                  >
                    Generate guest link
                  </Button>
                  <ul className="space-y-2 text-sm">
                    {tokens.map((token) => (
                      <li
                        key={token.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-brand-border px-3 py-2"
                      >
                        <span>
                          {token.label || "Link"} ·{" "}
                          {token.revoked_at ? "revoked" : "active"}
                        </span>
                        {!token.revoked_at ? (
                          <button
                            type="button"
                            className="text-xs font-semibold text-rose-700"
                            onClick={async () => {
                              await revokeGuestLink(token.id);
                              setTokens(await listGuestTokens(selected.id));
                            }}
                          >
                            Revoke
                          </button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>

                {selected.is_guest ? (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-brand-navy">
                      Link to registered user
                    </h3>
                    <p className="text-xs text-brand-muted">
                      Paste the Supabase auth user UUID after the client creates an account.
                    </p>
                    <input
                      className={fieldClassName()}
                      placeholder="auth user UUID"
                      value={linkUserId}
                      onChange={(event) => setLinkUserId(event.target.value)}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        try {
                          await linkClientToUser(selected.id, linkUserId.trim());
                          setLinkUserId("");
                          await reload();
                          const refreshed = (await searchClients(term)).find(
                            (row) => row.id === selected.id
                          );
                          if (refreshed) await selectClient(refreshed);
                        } catch (err) {
                          setError(err.message || "Unable to link account.");
                        }
                      }}
                    >
                      Link account
                    </Button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
