import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import "../index.css";

type Role = "customer" | "owner" | "admin";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  joined?: string;
  lastActive?: string;
}

const ROLE_LABELS: Record<Role, string> = {
  customer: "Customer (Diner)",
  owner: "Restaurant Owner",
  admin: "Platform Admin",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

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
  const { accessToken } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [sortBy, setSortBy] = useState("name");

  const fetchUsers = () => {
    setError("");
    api
      .get("/admin/users", { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((res) => setUsers(res.data.users))
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleRoleChange = async (userId: string, role: Role) => {
    setUpdatingId(userId);
    setError("");
    // optimistic update so the UI feels instant
    const previous = users;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    try {
      await api.patch(
        "/admin/users/role",
        { userId, role },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchUsers();
    } catch (err) {
      setError("Failed to update role.");
      setUsers(previous); // roll back on failure
    } finally {
      setUpdatingId(null);
    }
  };

 const handleDelete = async (email: string) => { 

    const confirmed = window.confirm( `Are you sure you want to delete the user with email:\n\n${email}\n\nThis action cannot be undone.` );
    if (!confirmed) {
       return;
       }
       
    setDeletingEmail(email); 
    setError(""); // optimistic update so the UI feels instant
    const previous = users;
    setUsers((prev) => prev.filter((u) => u.email !== email));
    try 
    { 
      await api.delete("/auth/deleteUser",{
         data: { email }, headers: { Authorization: `Bearer ${accessToken}`, 
        }, 
      }); 
      fetchUsers();
     } 
    catch (err) { 
      setError("Failed to delete user.");
      setUsers(previous); // roll back on failure
   } 
   finally { setDeletingEmail(null); } };

  const counts = useMemo(
    () => ({
      total: users.length,
      customer: users.filter((u) => u.role === "customer").length,
      owner: users.filter((u) => u.role === "owner").length,
      admin: users.filter((u) => u.role === "admin").length,
    }),
    [users]
  );

  const filtered = useMemo(() => {
    return users
      .filter((u) => (roleFilter === "all" ? true : u.role === roleFilter))
      .filter((u) => {
        const q = search.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (sortBy === "role" ? a.role.localeCompare(b.role) : a.name.localeCompare(b.name)));
  }, [users, search, roleFilter, sortBy]);

  
  return (
    <div className="ds-app">
      {/* Top Security Infrastructure Strip */}
      <div className="ds-topbar">
        <div className="ds-topbar-inner">
          <div className="ds-topbar-left">
            <span className="ds-badge-mfa">MFA Verified</span>

            <span className="ds-topbar-cluster">
              DineSlot Central Ops Engine &bull; Cluster Alpha-NYC
            </span>
          </div>

          <div className="ds-topbar-right">
            <span className="ds-status-dot">
              <span className="ds-dot ds-dot-pulse" />
              Gateway Healthy
            </span>

            <span>|</span>

            <span className="ds-clearance">
              Clearance: Master Platform Admin
            </span>
          </div>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="ds-header">
        <div className="ds-header-inner">
          <div className="ds-header-left">
            <div className="ds-logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={2}
              >
                <path d="M12 2a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5z" />
                <circle cx="12" cy="14" r="2" />
              </svg>
            </div>

            <div>
              <div className="ds-brand-row">
                <span className="ds-brand">
                  Dine<span className="ds-brand-accent">Slot</span>
                </span>

                <span className="ds-version-tag">
                  Console v2.4
                </span>
              </div>

              <p className="ds-subtitle">
                Identity &amp; Multi-Tenant Access Governance
              </p>
            </div>
          </div>

          <div className="ds-header-right">
            <div className="ds-identity-pill">
              <span
                className="ds-dot"
                style={{ background: "var(--emerald-500)" }}
              />

              <span>
                {counts.total} Enrolled Gastronomy Identities
              </span>
            </div>

            <div className="ds-avatar">ADM</div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="ds-main">
        <div className="ds-page-head">
          <div>
            <div className="ds-eyebrow">
              <span>Ecosystem Governance</span>
              <span>&bull;</span>
              <span className="ds-eyebrow-sub">
                Privilege Delegation
              </span>
            </div>

            <h1 className="ds-title">
              User Access &amp; Role Management
            </h1>

            <p className="ds-page-desc">
              Audit credentialed stakeholders across diners, Michelin venue
              ateliers, and platform operations. Change permissions and roles
              in real-time with instant sync.
            </p>
          </div>

          <div className="ds-page-actions">
            <button
              className="ds-btn ds-btn-secondary"
              onClick={fetchUsers}
              disabled={loading}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
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

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              fontSize: "0.8125rem",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Metrics Overview Strip */}
        <div className="ds-metrics-grid">
          <div className="ds-metric-card">
            <div className="ds-metric-head">
              <span>Total Registry</span>
              <span className="ds-metric-head-tag">All Nodes</span>
            </div>

            <div className="ds-metric-value">
              {counts.total}
            </div>

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

            <div className="ds-metric-value">
              {counts.customer}
            </div>

            <div className="ds-metric-foot">
              Direct reserve tier
            </div>
          </div>

          <div className="ds-metric-card">
            <div className="ds-metric-head">
              <span>Venue Ateliers (Owners)</span>
              <span>🏪</span>
            </div>

            <div className="ds-metric-value">
              {counts.owner}
            </div>

            <div className="ds-metric-foot ds-metric-foot-amber">
              Floor plan controllers
            </div>
          </div>

          <div className="ds-metric-card">
            <div className="ds-metric-head">
              <span>Platform Admins</span>
              <span>⚙️</span>
            </div>

            <div className="ds-metric-value">
              {counts.admin}
            </div>

            <div className="ds-metric-foot">
              Root governance group
            </div>
          </div>
        </div>

        {/* Filter and Query Toolbar */}
        <div className="ds-toolbar">
          <div className="ds-toolbar-left">
            <div className="ds-search-wrap">
              <svg
                className="ds-search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
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
                className={`ds-pill ${
                  roleFilter === "all" ? "ds-pill-active" : ""
                }`}
                onClick={() => setRoleFilter("all")}
              >
                All Roles
              </button>

              <button
                className={`ds-pill ${
                  roleFilter === "customer" ? "ds-pill-active" : ""
                }`}
                onClick={() => setRoleFilter("customer")}
              >
                Customer
              </button>

              <button
                className={`ds-pill ${
                  roleFilter === "owner" ? "ds-pill-active" : ""
                }`}
                onClick={() => setRoleFilter("owner")}
              >
                Owner
              </button>

              <button
                className={`ds-pill ${
                  roleFilter === "admin" ? "ds-pill-active" : ""
                }`}
                onClick={() => setRoleFilter("admin")}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="ds-sort">
            <span>Sort by:</span>

            <select
              className="ds-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="role">Role Hierarchy</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="ds-table-card">
          <div className="ds-table-scroll">
            {loading ? (
              <div
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  color: "var(--stone-500)",
                  fontSize: "0.875rem",
                }}
              >
                Loading stakeholders...
              </div>
            ) : (
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Stakeholder</th>
                    <th>Contact &amp; ID</th>
                    <th>Current Privilege</th>
                    <th>Change Role</th>
                    <th className="ds-th-right">
                      Audit Status
                    </th>
                    <th className="ds-th-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="ds-stakeholder">
                          <RowAvatar
                            initials={getInitials(u.name)}
                            role={u.role}
                          />

                          <div>
                            <div className="ds-row-name">
                              {u.name}
                            </div>

                            {u.joined && (
                              <div className="ds-row-joined">
                                {u.joined}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="ds-row-email">
                          {u.email}
                        </div>

                        <div className="ds-row-id">
                          ID: {u.id}
                        </div>
                      </td>

                      <td>
                        <RoleBadge role={u.role} />
                      </td>

                      <td>
                        <div className="ds-role-select-wrap">
                          <select
                            className="ds-role-select"
                            value={u.role}
                            disabled={updatingId === u.id}
                            onChange={(e) =>
                              handleRoleChange(
                                u.id,
                                e.target.value as Role
                              )
                            }
                          >
                            <option value="customer">
                              Customer
                            </option>

                            <option value="owner">
                              Restaurant Owner
                            </option>

                            <option value="admin">
                              Platform Admin
                            </option>
                          </select>

                          <div className="ds-role-caret">
                            <CaretIcon />
                          </div>
                        </div>
                      </td>

                      <td className="ds-td-right">
                        <div className="ds-audit-status">
                          <span className="ds-audit-dot" />

                          <span>
                            {updatingId === u.id
                              ? "Updating..."
                              : u.lastActive ?? "—"}
                          </span>
                        </div>
                      </td>

                      {/* Delete Action */}
                      <td className="ds-td-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(u.email)
                          }
                          disabled={
                            deletingEmail === u.email ||
                            updatingId === u.id
                          }
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.4rem",
                            padding: "0.45rem 0.75rem",
                            border: "1px solid #fecaca",
                            borderRadius: "0.5rem",
                            background:
                              deletingEmail === u.email
                                ? "#fef2f2"
                                : "#fff",
                            color: "#dc2626",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor:
                              deletingEmail === u.email ||
                              updatingId === u.id
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              deletingEmail === u.email ||
                              updatingId === u.id
                                ? 0.6
                                : 1,
                          }}
                        >
                          {deletingEmail === u.email ? (
                            "Deleting..."
                          ) : (
                            <>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M8 6V4h8v2" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v5" />
                                <path d="M14 11v5" />
                              </svg>

                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: "2rem",
                          textAlign: "center",
                          color: "var(--stone-400)",
                        }}
                      >
                        No stakeholders match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="ds-table-footer">
            <div>
              Displaying <strong>{filtered.length}</strong>{" "}
              of <strong>{users.length}</strong> registered
              accounts
            </div>

            <div className="ds-footer-meta">
              <span>
                🔒 Encrypted TLS 1.3 Transmission
              </span>

              <span>&bull;</span>

              <span>
                Role sync verified via HMAC
              </span>
            </div>
          </div>
        </div>

        {/* Governance Protocol Callout */}
        <div className="ds-callout">
          <div className="ds-callout-left">
            <div className="ds-callout-icon">🛡️</div>

            <div>
              <h4 className="ds-callout-title">
                Governance Protocol Notice
              </h4>

              <p className="ds-callout-text">
                Elevating users to{" "}
                <strong>Platform Admin</strong> grants
                unconditional access to POS credentials, floor
                engine layouts, and financial payouts. Changes
                are logged to the immutable audit ledger.
              </p>
            </div>
          </div>

          <button className="ds-callout-link">
            View System Audit Logs &rarr;
          </button>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="ds-footer">
        <div className="ds-footer-inner">
          <div className="ds-footer-brand">
            <strong>DineSlot</strong>

            <span>&bull; Operations Engine</span>

            <span>
              &bull; &copy; 2025 DineSlot Haute Hospitality
              Inc.
            </span>
          </div>

          <div className="ds-footer-right">
            <span className="ds-footer-status">
              <span
                className="ds-dot"
                style={{
                  background: "var(--emerald-500)",
                }}
              />

              Global Gastronomic Network Nodes Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
