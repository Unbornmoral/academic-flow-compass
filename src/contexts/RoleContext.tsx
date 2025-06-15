
import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'student' | 'lecturer' | 'developer' | null;

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  canUpload: boolean;
  canView: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider = ({ children }: RoleProviderProps) => {
  const [role, setRole] = useState<Role>(null);

  const canUpload = role === 'lecturer' || role === 'developer';
  const canView = role !== null;

  return (
    <RoleContext.Provider value={{ role, setRole, canUpload, canView }}>
      {children}
    </RoleContext.Provider>
  );
};
