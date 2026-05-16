import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSubject, useCreateSubject, useUpdateSubject } from '../hooks';
import { useTeachers } from '../../users/hooks';
import { ArrowLeft, Save, Loader2, BookOpen } from 'lucide-react';

const surface = 'var(--bg-surface)';
const border  = 'var(--border)';
const accent  = 'var(--accent)';
const textPri = 'var(--text-primary)';
const textSec = 'var(--text-secondary)';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  backgroundColor: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  borderRadius: '0.5rem',
  color: textPri,
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: textSec,
  marginBottom: '0.4rem',
};

export const SubjectFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: subject, isLoading: isLoadingSubject } = useSubject(id || '');
  const { data: teachers, isLoading: isLoadingTeachers } = useTeachers();
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    credits: 3,
    teacherId: '',
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        code:        subject.code,
        name:        subject.name,
        description: subject.description || '',
        credits:     subject.credits || 3,
        teacherId:   subject.teacherId || '',
      });
    }
  }, [subject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: id!, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      navigate('/subjects');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isEdit && isLoadingSubject) return (
    <div style={{ display: 'flex', height: '16rem', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={28} className="animate-spin" style={{ color: accent }} />
    </div>
  );

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const focusIn  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = accent);
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = 'var(--input-border)');

  return (
    <div style={{ padding: '2rem 2.5rem', maxWidth: '640px', margin: '0 auto' }}>

      {/* ── Back link ── */}
      <button
        onClick={() => navigate('/subjects')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'none',
          border: 'none',
          color: textSec,
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontSize: '0.82rem',
          fontWeight: 500,
          padding: 0,
          transition: 'color 0.12s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = textPri)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = textSec)}
      >
        <ArrowLeft size={15} />
        Back to Subjects
      </button>

      {/* ── Page title ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '9px',
          backgroundColor: 'var(--accent-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <BookOpen size={18} color={accent} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: textPri, margin: 0 }}>
            {isEdit ? 'Edit Subject' : 'Add New Subject'}
          </h1>
          <p style={{ fontSize: '0.78rem', color: textSec, marginTop: '0.1rem' }}>
            {isEdit ? 'Update the subject details below.' : 'Fill in the details to create a new subject.'}
          </p>
        </div>
      </div>

      {/* ── Form card ── */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: surface,
          border: `1px solid ${border}`,
          borderRadius: '0.875rem',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Code + Name */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Subject Code</label>
            <input
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. MATH101"
              style={inputStyle}
              onFocus={focusIn} onBlur={focusOut}
            />
          </div>
          <div>
            <label style={labelStyle}>Subject Name</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Advanced Algebra"
              style={inputStyle}
              onFocus={focusIn} onBlur={focusOut}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the learning objectives..."
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' } as React.CSSProperties}
            onFocus={focusIn} onBlur={focusOut}
          />
        </div>

        {/* Instructor */}
        <div>
          <label style={labelStyle}>Instructor (Teacher)</label>
          <select
            required
            value={formData.teacherId}
            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
            style={{ ...inputStyle, appearance: 'none' } as React.CSSProperties}
            onFocus={focusIn} onBlur={focusOut}
          >
            <option value="">Select a teacher…</option>
            {teachers?.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.firstName} {t.lastName}
              </option>
            ))}
          </select>
          {isLoadingTeachers && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '0.75rem', color: textSec }}>
              <Loader2 size={12} className="animate-spin" /> Loading teachers…
            </div>
          )}
        </div>

        {/* Credits */}
        <div>
          <label style={labelStyle}>Credits</label>
          <input
            type="number"
            min={1}
            max={10}
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            style={{ ...inputStyle, width: '110px' }}
            onFocus={focusIn} onBlur={focusOut}
          />
          <p style={{ fontSize: '0.72rem', color: textSec, marginTop: '0.3rem' }}>Between 1 and 10 units.</p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: border }} />

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              backgroundColor: isSubmitting ? 'var(--text-muted)' : accent,
              color: '#fff',
              padding: '0.7rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-hover)'; }}
            onMouseLeave={(e) => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = accent; }}
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? 'Save Changes' : 'Create Subject'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/subjects')}
            style={{
              flex: 1,
              padding: '0.7rem',
              borderRadius: '0.5rem',
              border: `1px solid ${border}`,
              backgroundColor: 'transparent',
              color: textSec,
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--bg-elevated)';
              (e.currentTarget as HTMLButtonElement).style.color = textPri;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = textSec;
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
