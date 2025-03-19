import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: async () => {},
    logout: async () => {},
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/check', {
                credentials: 'include'
            });
            setIsAuthenticated(response.ok);
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async () => {
        try {
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error updating auth state:', error);
            setIsAuthenticated(false);
        }
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};