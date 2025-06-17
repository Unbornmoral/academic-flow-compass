
import { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'student' | 'lecturer' | 'administrator' | 'developer' | null;

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  canUpload: boolean;
  canView: boolean;
  canEditCourses: boolean;
  canEditContent: boolean;
  canDeleteCourses: boolean;
  canUploadFiles: boolean;
  canEditAssignments: boolean;
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

  const canUpload = role === 'lecturer' || role === 'administrator' || role === 'developer';
  const canView = role !== null;
  const canEditCourses = role === 'lecturer' || role === 'administrator' || role === 'developer';
  const canEditContent = role === 'administrator' || role === 'developer';
  const canDeleteCourses = role === 'administrator' || role === 'developer';
  const canUploadFiles = role === 'lecturer' || role === 'administrator' || role === 'developer';
  const canEditAssignments = role === 'lecturer' || role === 'administrator' || role === 'developer';

  return (
    <RoleContext.Provider value={{ 
      role, 
      setRole, 
      canUpload, 
      canView, 
      canEditCourses,
      canEditContent,
      canDeleteCourses,
      canUploadFiles,
      canEditAssignments
    }}>
      {children}
    </RoleContext.Provider>
  );
};
