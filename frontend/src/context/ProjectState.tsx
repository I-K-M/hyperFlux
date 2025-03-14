import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
    isProduction: boolean;
    toProduction: () => void;
    toDevelopment: () => void;
};

export const ProjectState = createContext<AuthContextType>({
    isProduction: false,
    toProduction: () => {},
    toDevelopment: () => {},
});

interface ProjectStateProviderProps {
    children: ReactNode;
}

export const ProjectStateProvider: React.FC<ProjectStateProviderProps> = ({ children }) => {
    const [isProduction, setIsProduction] = useState<boolean>(false);

    const toProduction = () => {
        setIsProduction: true;
    };
    const toDevelopment = () => {
        setIsProduction: false;
    };

return (
    <ProjectState.Provider value={{ isProduction, toProduction, toDevelopment }}>
      {children}
    </ProjectState.Provider>
  );
};