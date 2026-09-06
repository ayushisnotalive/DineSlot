import { useState } from "react";
import "../index.css"

type Role = "customer" | "owner" | "admin";

interface Stakeholder {
  id: string;
  name: string;
  initials: string;
  joined: string;
  email: string;
  role: Role;
  lastActive: string;
  activeNow?: boolean;
}

const ROLE_LABELS: Record<Role, string> = {
  customer: "Customer (Diner)",
  owner: "Restaurant Owner",
  admin: "Platform Admin",
};

const INITIAL_STAKEHOLDERS: Stakeholder[] = [
  {
    id: "usr_94821",
    name: "Alain Ducasse",
    initials: "AD",
    joined: "Joined Oct 12, 2024",
    email: "atelier.ducasse@paris-gastronomy.fr",
    role: "owner",
    lastActive: "12m ago",
  },
  {
    id: "usr_10284",
    name: "Eleanor Vance",
    initials: "EV",
    joined: "Joined Jan 15, 2025",
    email: "e.vance@sommelier-guild.org",
    role: "customer",
    lastActive: "Just now",
  },
  {
    id: "usr_00391",
    name: "Chef Kenjiro Sato",
    initials: "KS",
    joined: "Joined Nov 03, 2024",
    email: "ginza.shinwa@omakase-vault.jp",
    role: "owner",
    lastActive: "1h ago",
  },
  {
    id: "usr_00012",
    name: "Henrietta Sterling",
    initials: "HS",
    joined: "Joined Aug 20, 2024",
    email: "h.sterling@dineslot-ops.internal",
    role: "admin",
    lastActive: "Active Now",
    activeNow: true,
  },
  {
    id: "usr_44910",
    name: "Marcus Aurelius Thorne",
    initials: "MT",
    joined: "Joined Dec 02, 2024",
    email: "m.thorne@mayfair-invest.co.uk",
    role: "customer",
    lastActive: "3h ago",
  },
  {
    id: "usr_77215",
    name: "Camille Claudel",
    initials: "CC",
    joined: "Joined Jan 04, 2025",
    email: "cellar@larpege-haute.com",
    role: "owner",
    lastActive: "5m ago",
  },
  {
    id: "usr_88301",
    name: "Devon Scott",
    initials: "DS",
    joined: "Joined Sep 11, 2024",
    email: "d.scott@apex-cloud.io",
    role: "admin",
    lastActive: "42m ago",
  },
];

function RoleBadge({ role }: { role: Role }) {
  const cls =
    role === "owner"
      ? "ds-badge ds-badge-owner"
      : role === "admin"
      ? "ds-badge ds-badge-admin"
      : "ds-badge ds-badge-customer";
  return (
    <span className={cls}>
      <span className="ds-dot" />
      {ROLE_LABELS[role]}
    </span>
  );
}

function RowAvatar({ initials, role }: { initials: string; role: Role }) {
  const cls =
    role === "owner"
      ? "ds-row-avatar ds-row-avatar-owner"
      : role === "admin"
      ? "ds-row-avatar ds-row-avatar-admin"
      : "ds-row-avatar ds-row-avatar-customer";
  return <div className={cls}>{initials}</div>;
}

function CaretIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function AdminPanel() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(INITIAL_STAKEHOLDERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [sortBy, setSortBy] = useState("name");

  const handleRoleChange = (id: string, role: Role) => {
    setStakeholders((prev) => prev.map((s) => (s.id === id ? { ...s, role } : s)));
  };

  const filtered = stakeholders
    .filter((s) => (roleFilter === "all" ? true : s.role === roleFilter))
    .filter((s) => {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "role") return a.role.localeCompare(b.role);
      return a.name.localeCompare(b.name);
    });

  const counts = {
    total: stakeholders.length,
    customer: stakeholders.filter((s) => s.role === "customer").length,
    owner: stakeholders.filter((s) => s.role === "owner").length,
    admin: stakeholders.filter((s) => s.role === "admin").length,
  };

  return (
    <div className="ds-app">
      {/* Top Security Infrastructure Strip */}
      <div className="ds-topbar">
        <div className="ds-topbar-inner">
          <div className="ds-topbar-left">
            <span className="ds-badge-mfa">MFA Verified</span>
            <span className="ds-topbar-cluster">
              DineSlot Central Ops Engine &bull; Cluster Alpha-NYC &bull; Session ID: #DS-88204
            </span>
          </div>
          <div className="ds-topbar-right">
            <span className="ds-status-dot">
              <span className="ds-dot ds-dot-pulse" />
              Gateway Healthy
            </span>
            <span>|</span>
            <span className="ds-clearance">Clearance: Master Platform Admin</span>
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="ds-header">
        <div className="ds-header-inner">
          <div className="ds-header-left">
            <div className="ds-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}>
                <path d="M12 2a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5z" />
                <circle cx="12" cy="14" r="2" />
              </svg>
            </div>
            <div>
              <div className="ds-brand-row">
                <span className="ds-brand">
                  Dine<span className="ds-brand-accent">Slot</span>
                </span>
                <span className="ds-version-tag">Console v2.4</span>
              </div>
              <p className="ds-subtitle">Identity &amp; Multi-Tenant Access Governance</p>
            </div>
          </div>

          <div className="ds-header-right">
            <div className="ds-identity-pill">
              <span className="ds-dot" style={{ background: "var(--emerald-500)" }} />
              <span>{counts.total} Enrolled Gastronomy Identities</span>
            </div>
            <div className="ds-avatar">ADM</div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="ds-main">
        {/* Page Breadcrumb & Title Section */}
        <div className="ds-page-head">
          <div>
            <div className="ds-eyebrow">
              <span>Ecosystem Governance</span>
              <span>&bull;</span>
              <span className="ds-eyebrow-sub">Privilege Delegation</span>
            </div>
            <h1 className="ds-title">User Access &amp; Role Management</h1>
            <p className="ds-page-desc">
              Audit credentialed stakeholders across diners, Michelin venue ateliers, and platform
              operations. Change permissions and roles in real-time with instant sync.
            </p>
          </div>

          <div className="ds-page-actions">
            <button className="ds-btn ds-btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              Refresh Directory
            </button>
            <button className="ds-btn ds-btn-primary">
              <span className="ds-btn-plus">+</span>
              Provision Stakeholder
            </button>
          </div>
        </div>

        {/* Metrics Overview Strip */}
        <div className="ds-metrics-grid">
          <div className="ds-metric-card">
            <div className="ds-metric-head">
              <span>Total Registry</span>
              <span className="ds-metric-head-tag">All Nodes</span>
            </div>
            <div className="ds-metric-value">{counts.total}</div>
            <div className="ds-metric-foot ds-metric-foot-green">
              <span className="ds-dot-sm" />
              100% Identity verified
            </div>
          </div>

          <div className="ds-metric-card">
            <div className="ds-metric-head">
              <span>Diners (Customers)</span>
              <span>🍽️</span>
            </div>
            <div className="ds-metric-value">{counts.customer}</div>
            <div className="ds-metric-foot">Direct reserve tier</div>
          </div>

          <div className="ds-metric-card">
            <div className="ds-metric-head">
              <span>Venue Ateliers (Owners)</span>
              <span>🏪</span>
            </div>
            <div className="ds-metric-value">{counts.owner}</div>
            <div className="ds-metric-foot ds-metric-foot-amber">Floor plan controllers</div>
          </div>

          <div className="ds-metric-card">
            <div className="ds-metric-head">
              <span>Platform Admins</span>
              <span>⚙️</span>
            </div>
            <div className="ds-metric-value">{counts.admin}</div>
            <div className="ds-metric-foot">Root governance group</div>
          </div>
        </div>

        {/* Filter and Query Toolbar */}
        <div className="ds-toolbar">
          <div className="ds-toolbar-left">
            <div className="ds-search-wrap">
              <svg className="ds-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                className="ds-search-input"
                placeholder="Search by name, email, or stakeholder ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="ds-role-pills">
              <button
                className={`ds-pill ${roleFilter === "all" ? "ds-pill-active" : ""}`}
                onClick={() => setRoleFilter("all")}
              >
                All Roles
              </button>
              <button
                className={`ds-pill ${roleFilter === "customer" ? "ds-pill-active" : ""}`}
                onClick={() => setRoleFilter("customer")}
              >
                Customer
              </button>
              <button
                className={`ds-pill ${roleFilter === "owner" ? "ds-pill-active" : ""}`}
                onClick={() => setRoleFilter("owner")}
              >
                Owner
              </button>
              <button
                className={`ds-pill ${roleFilter === "admin" ? "ds-pill-active" : ""}`}
                onClick={() => setRoleFilter("admin")}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="ds-sort">
            <span>Sort by:</span>
            <select className="ds-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name (A-Z)</option>
              <option value="role">Role Hierarchy</option>
              <option value="activity">Activity Volume</option>
            </select>
          </div>
        </div>

        {/* Elevated Editorial Table Container */}
        <div className="ds-table-card">
          <div className="ds-table-scroll">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Stakeholder</th>
                  <th>Contact &amp; ID</th>
                  <th>Current Privilege</th>
                  <th>Change Role</th>
                  <th className="ds-th-right">Audit Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="ds-stakeholder">
                        <RowAvatar initials={s.initials} role={s.role} />
                        <div>
                          <div className="ds-row-name">{s.name}</div>
                          <div className="ds-row-joined">{s.joined}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="ds-row-email">{s.email}</div>
                      <div className="ds-row-id">ID: {s.id}</div>
                    </td>
                    <td>
                      <RoleBadge role={s.role} />
                    </td>
                    <td>
                      <div className="ds-role-select-wrap">
                        <select
                          className="ds-role-select"
                          value={s.role}
                          onChange={(e) => handleRoleChange(s.id, e.target.value as Role)}
                        >
                          <option value="customer">Customer</option>
                          <option value="owner">Restaurant Owner</option>
                          <option value="admin">Platform Admin</option>
                        </select>
                        <div className="ds-role-caret">
                          <CaretIcon />
                        </div>
                      </div>
                    </td>
                    <td className="ds-td-right">
                      <div className="ds-audit-status">
                        <span
                          className="ds-audit-dot"
                          style={s.activeNow ? { animation: "ds-pulse 2s infinite" } : undefined}
                        />
                        <span>{s.lastActive}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Summary Bar */}
          <div className="ds-table-footer">
            <div>
              Displaying <strong>{filtered.length}</strong> of <strong>{stakeholders.length}</strong>{" "}
              registered accounts
            </div>
            <div className="ds-footer-meta">
              <span>🔒 Encrypted TLS 1.3 Transmission</span>
              <span>&bull;</span>
              <span>Role sync verified via HMAC</span>
            </div>
          </div>
        </div>

        {/* Governance Protocol Callout */}
        <div className="ds-callout">
          <div className="ds-callout-left">
            <div className="ds-callout-icon">🛡️</div>
            <div>
              <h4 className="ds-callout-title">Governance Protocol Notice</h4>
              <p className="ds-callout-text">
                Elevating users to <strong>Platform Admin</strong> grants unconditional access to
                POS credentials, floor engine layouts, and financial payouts. Changes are logged to
                the immutable audit ledger.
              </p>
            </div>
          </div>
          <button className="ds-callout-link">View System Audit Logs &rarr;</button>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="ds-footer">
        <div className="ds-footer-inner">
          <div className="ds-footer-brand">
            <strong>DineSlot</strong>
            <span>&bull; Operations Engine</span>
            <span>&bull; &copy; 2025 DineSlot Haute Hospitality Inc.</span>
          </div>
          <div className="ds-footer-right">
            <span className="ds-footer-status">
              <span className="ds-dot" style={{ background: "var(--emerald-500)" }} />
              Global Gastronomic Network Nodes Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
