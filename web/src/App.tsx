import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import { VerifyEmailPage } from './routes/VerifyEmailPage';
import { SubjectsListPage } from './features/subjects/pages/SubjectsListPage';
import { SubjectFormPage } from './features/subjects/pages/SubjectFormPage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { AttendancePage } from './features/attendance/pages/AttendancePage';
import { UserAuditPage } from './features/users/pages/UserAuditPage';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/pages/ResetPasswordPage';
import { useAuth } from './hooks/useAuth';
import {
  BookOpen,
  Calendar,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Settings,
} from 'lucide-react';

/* ─── Sidebar nav item ─────────────────────────────────────────── */
function NavItem({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.55rem 0.85rem',
        borderRadius: '0.5rem',
        textDecoration: 'none',
        fontSize: '0.875rem',
        fontWeight: active ? 600 : 500,
        color: active ? '#fff' : 'var(--text-secondary)',
        backgroundColor: active ? 'var(--accent)' : 'transparent',
        transition: 'all 0.15s',
        marginBottom: '0.15rem',
      }}
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}

/* ─── Sidebar section label ────────────────────────────────────── */
function SectionLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: '0.65rem',
        fontWeight: 700,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        padding: '0.75rem 0.85rem 0.3rem',
        marginTop: '0.5rem',
      }}
    >
      {label}
    </div>
  );
}

/* ─── Layout ───────────────────────────────────────────────────── */
function Layout() {
  const { user, hasRole, logout, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const guestRoutes = ['/', '/login', '/forgot-password', '/reset-password', '/verify-email'];
  const isGuestRoute = guestRoutes.some(
    (r) => location.pathname === r || location.pathname.startsWith(r + '?'),
  );
  const showSidebar = isAuthenticated && !isGuestRoute;

  if (isLoading) return null;

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems = [
    { label: 'Dashboard',  path: '/subjects',    icon: LayoutDashboard, roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
    { label: 'Users',      path: '/audit',        icon: Users,           roles: ['ADMIN'] },
    { label: 'Students',   path: '/subjects',     icon: GraduationCap,   roles: ['ADMIN', 'TEACHER'] },
    { label: 'Teachers',   path: '/subjects',     icon: School,          roles: ['ADMIN'] },
  ];

  const academicNavItems = [
    { label: 'Attendance', path: '/attendance',  icon: Calendar,        roles: ['TEACHER'] },
    { label: 'Grades',     path: '/subjects',    icon: BookOpen,        roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
    { label: 'Settings',   path: '/subjects',    icon: Settings,        roles: ['ADMIN'] },
  ];

  /* Initials avatar */
  const initials = isAuthenticated
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'U';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      {/* ── Sidebar ── */}
      {showSidebar && (
        <aside
          style={{
            width: 'var(--sidebar-width)',
            backgroundColor: 'var(--sidebar-bg)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            height: '100vh',
            flexShrink: 0,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '1.25rem 1rem',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <School size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              SchoolMS
            </span>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '0.5rem 0.6rem', overflowY: 'auto' }}>
            <SectionLabel label="Main" />
            {mainNavItems
              .filter((i) => i.roles.some((r) => hasRole(r)))
              .map((i) => (
                <NavItem key={i.path + i.label} to={i.path} icon={i.icon} label={i.label} active={isActive(i.path) && i.label !== 'Students' && i.label !== 'Teachers'} />
              ))}

            <SectionLabel label="Academic" />
            {academicNavItems
              .filter((i) => i.roles.some((r) => hasRole(r)))
              .map((i) => (
                <NavItem key={i.path + i.label} to={i.path} icon={i.icon} label={i.label} active={isActive(i.path) && i.label === 'Attendance'} />
              ))}
          </nav>

          {/* Bottom user strip */}
          <div
            style={{
              padding: '0.85rem 1rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {isAuthenticated ? `${user.firstName} ${user.lastName}` : 'Guest'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {isAuthenticated ? user.roles?.[0] ?? '' : ''}
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '4px',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = '#f87171')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)')}
            >
              <LogOut size={16} />
            </button>
          </div>
        </aside>
      )}

      {/* ── Main content ── */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: !isAuthenticated ? 'center' : 'stretch',
          justifyContent: !isAuthenticated ? 'center' : 'flex-start',
        }}
      >
        <div style={{ width: '100%' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

/* ─── Register page ────────────────────────────────────────────── */
function RegisterPlaceholder() {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.65rem 0.85rem',
    backgroundColor: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    borderRadius: '0.5rem',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '0.35rem',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9px',
                backgroundColor: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <School size={20} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              SchoolMS
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Create an account
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Fill in the details below to get started.
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const body = Object.fromEntries(data.entries());
              try {
                const res = await fetch('http://localhost:3000/api/v1/auth/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
                });
                const json = await res.json();
                alert(json.message || 'Success! Check your terminal for the verification link.');
              } catch (err: any) {
                alert('Error: ' + err.message);
              }
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input name="firstName" required style={inputStyle} placeholder="John" />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input name="lastName" required style={inputStyle} placeholder="Wick" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <input name="email" type="email" required style={inputStyle} placeholder="john@example.com" />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input name="password" type="password" required style={inputStyle} placeholder="••••••••••" />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-hover)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent)')}
            >
              Register User
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── App ──────────────────────────────────────────────────────── */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RegisterPlaceholder />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Subjects */}
        <Route path="/subjects" element={<SubjectsListPage />} />
        <Route path="/subjects/new" element={<SubjectFormPage />} />
        <Route path="/subjects/edit/:id" element={<SubjectFormPage />} />

        {/* Attendance */}
        <Route path="/attendance" element={<AttendancePage />} />

        {/* Audit */}
        <Route path="/audit" element={<UserAuditPage />} />

        <Route
          path="*"
          element={
            <div style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
              Page Not Found. <Link to="/" style={{ color: 'var(--accent)' }}>Go Home</Link>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
