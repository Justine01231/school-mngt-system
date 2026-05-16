import React, { ReactElement, useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/auth-store';
import { authStorage } from '../../../lib/auth-storage';
import { refreshAccessToken } from '../services/auth.service';
import { Spinner } from '../../../components/Spinner';

interface Props {
  children: React.ReactNode;
}

export const AuthBootstrap = ({ children }: Props): ReactElement => {
  const status = useAuthStore((s: any) => s.status);
  const [didRun, setDidRun] = useState(false);

  useEffect(() => {
    if (didRun) return;
    setDidRun(true);

    const run = async (): Promise<void> => {
      const refreshToken = authStorage.getRefreshToken();
      if (refreshToken === null) {
        useAuthStore.getState().clearSession();
        return;
      }
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken === null) {
        useAuthStore.getState().clearSession();
      }
    };
    void run();
  }, [didRun]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <Spinner label="Loading session" />
      </div>
    );
  }
  return <>{children}</>;
};
