import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubjects, useDeleteSubject } from '../hooks';
import { Plus, Pencil, Trash2, Loader2, AlertCircle, BookOpen, Users, Star } from 'lucide-react';
import { RoleGate } from '../../../components/RoleGate';
import { Pagination } from '../../../components/Pagination';

/* ── shared dark-theme token shortcuts ───────────────────── */
const surface   = 'var(--bg-surface)';
const elevated  = 'var(--bg-elevated)';
const border    = 'var(--border)';
const accent    = 'var(--accent)';
const textPri   = 'var(--text-primary)';
const textSec   = 'var(--text-secondary)';
const textMuted = 'var(--text-muted)';

/* ── tiny stat card ──────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: elevated,
        border: `1px solid ${border}`,
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Icon size={14} color={textMuted} />
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <span style={{ fontSize: '1.6rem', fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

export const SubjectsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useSubjects(page);
  const deleteMutation = useDeleteSubject();

  const subjects = (data as any)?.items || [];
  const meta     = (data as any)?.meta;

  const totalSubjects  = meta?.total ?? subjects.length;
  const withTeacher    = subjects.filter((s: any) => s.teacherId).length;
  const avgCredits     = subjects.length
    ? (subjects.reduce((sum: number, s: any) => sum + (s.credits || 0), 0) / subjects.length).toFixed(1)
    : '—';

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this subject? This cannot be undone.')) {
      try { await deleteMutation.mutateAsync(id); }
      catch (err: any) { alert(err.message); }
    }
  };

  if (isLoading) return (
    <div style={{ display: 'flex', height: '16rem', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={30} className="animate-spin" style={{ color: accent }} />
    </div>
  );

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: textPri, margin: 0 }}>Subjects</h1>
          <p style={{ fontSize: '0.85rem', color: textSec, marginTop: '0.25rem' }}>
            Manage school curriculum and subject credits.
          </p>
        </div>
        <RoleGate allowedRoles={['ADMIN']}>
          <button
            onClick={() => navigate('/subjects/new')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: accent,
              color: '#fff',
              padding: '0.55rem 1.1rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-hover)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = accent)}
          >
            <Plus size={16} />
            Add Subject
          </button>
        </RoleGate>
      </header>

      {/* ── Stat cards ── */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem' }}>
        <StatCard icon={BookOpen}  label="Total Subjects"    value={totalSubjects}  color={textPri} />
        <StatCard icon={Users}     label="With Instructor"   value={withTeacher}    color="var(--badge-active-text)" />
        <StatCard icon={Star}      label="Avg. Credits"      value={avgCredits}     color="#facc15" />
      </div>

      {/* ── Error ── */}
      {error ? (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.85rem 1rem',
          backgroundColor: 'rgba(239,68,68,0.10)',
          border: '1px solid rgba(239,68,68,0.22)',
          borderRadius: '0.6rem',
          color: '#fca5a5',
          fontSize: '0.85rem',
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>Failed to load subjects. Make sure the API is running and you are authorized.</span>
        </div>
      ) : (
        /* ── Table ── */
        <div style={{
          backgroundColor: surface,
          border: `1px solid ${border}`,
          borderRadius: '0.75rem',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {['Code', 'Name', 'Credits', 'Instructor', 'Actions'].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: '0.85rem 1rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: textSec,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      textAlign: i === 4 ? 'right' : 'left',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3.5rem', textAlign: 'center', color: textMuted }}>
                    <BookOpen size={32} style={{ margin: '0 auto 0.75rem', display: 'block', opacity: 0.3 }} />
                    No subjects found.
                    <RoleGate allowedRoles={['ADMIN']}>
                      <span style={{ display: 'block', fontSize: '0.82rem', marginTop: '0.35rem' }}>
                        Click <strong style={{ color: textSec }}>"Add Subject"</strong> to create one.
                      </span>
                    </RoleGate>
                  </td>
                </tr>
              ) : (
                subjects.map((subject: any) => (
                  <tr
                    key={subject.id}
                    style={{ borderBottom: `1px solid ${border}`, transition: 'background 0.12s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = elevated)}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent')}
                  >
                    {/* Code */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.6rem',
                        backgroundColor: 'var(--accent-dim)',
                        color: accent,
                        borderRadius: '0.35rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                      }}>
                        {subject.code}
                      </span>
                    </td>
                    {/* Name */}
                    <td style={{ padding: '0.85rem 1rem', color: textPri, fontWeight: 500, fontSize: '0.875rem' }}>
                      {subject.name}
                    </td>
                    {/* Credits */}
                    <td style={{ padding: '0.85rem 1rem', color: textSec, fontSize: '0.875rem' }}>
                      {subject.credits != null
                        ? <span style={{ color: '#facc15', fontWeight: 600 }}>{subject.credits}</span>
                        : <span style={{ color: textMuted }}>—</span>}
                    </td>
                    {/* Instructor */}
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.875rem' }}>
                      {subject.teacher?.user?.lastName ? (
                        <span style={{ color: textPri }}>
                          {subject.teacher.user.firstName} {subject.teacher.user.lastName}
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '0.75rem',
                          color: textMuted,
                          backgroundColor: 'var(--bg-elevated)',
                          border: `1px solid ${border}`,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '0.3rem',
                        }}>
                          Unassigned
                        </span>
                      )}
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <RoleGate allowedRoles={['ADMIN']}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <button
                            onClick={() => navigate(`/subjects/edit/${subject.id}`)}
                            title="Edit"
                            style={{
                              padding: '0.35rem 0.6rem',
                              borderRadius: '0.4rem',
                              border: `1px solid ${border}`,
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              color: textSec,
                              transition: 'all 0.12s',
                              display: 'flex', alignItems: 'center',
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-dim)';
                              (e.currentTarget as HTMLButtonElement).style.color = accent;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                              (e.currentTarget as HTMLButtonElement).style.color = textSec;
                            }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(subject.id)}
                            title="Delete"
                            style={{
                              padding: '0.35rem 0.6rem',
                              borderRadius: '0.4rem',
                              border: '1px solid rgba(239,68,68,0.25)',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              color: '#f87171',
                              transition: 'all 0.12s',
                              display: 'flex', alignItems: 'center',
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(239,68,68,0.12)')}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent')}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </RoleGate>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {meta && (
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          totalItems={meta.total}
          limit={meta.limit}
        />
      )}
    </div>
  );
};
