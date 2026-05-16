import React, { ReactNode } from 'react';
import { useAuth } from '../../../hooks/useAuth';

interface RoleGateProps {
  roles: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export const RoleGate = ({ roles, fallback = null, children }: RoleGateProps): ReactNode => {
  const { user } = useAuth();
  if (user === null) return fallback;
  const allowed = user.roles.some((r: string) => roles.includes(r));
  return allowed ? children : fallback;
};
