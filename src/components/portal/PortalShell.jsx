import { Link, NavLink, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Container from "../ui/Container";

export default function PortalShell({
  title,
  navItems = [],
  accent = "Staff",
}) {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-brand-border/70 bg-brand-navy text-white">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="EconoPro Services"
                className="h-10 w-10 rounded-2xl object-cover"
              />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-brand-gold">
                  {accent}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                {profile?.full_name || profile?.email}
              </p>
              <p className="text-xs capitalize text-slate-300">{profile?.role}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-brand-gold hover:text-brand-gold"
            >
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </Container>
      </header>

      {navItems.length > 0 ? (
        <div className="border-b border-brand-border bg-white">
          <Container className="flex gap-6 overflow-x-auto py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "whitespace-nowrap text-sm font-semibold transition",
                    isActive
                      ? "text-brand-navy"
                      : "text-slate-500 hover:text-brand-navy",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </Container>
        </div>
      ) : null}

      <main>
        <Outlet />
      </main>
    </div>
  );
}
