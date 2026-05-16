import React, { ReactElement } from 'react';

interface SpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner = ({ label, size = 'md' }: SpinnerProps): ReactElement => {
  const sizeMap = {
    sm: '24',
    md: '32',
    lg: '48',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      {label && <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>{label}</p>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
