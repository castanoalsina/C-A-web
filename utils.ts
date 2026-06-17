import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserWithPassword extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    const storedUser = localStorage.getItem('cya_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulación de login - en producción, esto sería una llamada a API
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    // Validar que el usuario existe (simulado)
    const users = JSON.parse(localStorage.getItem('cya_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (!foundUser) {
      throw new Error('Email o contraseña incorrectos');
    }

    const userData: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name
    };

    setUser(userData);
    localStorage.setItem('cya_user', JSON.stringify(userData));
  };

  const register = async (email: string, name: string, password: string) => {
    // Validación básica
    if (!email || !name || !password) {
      throw new Error('Todos los campos son requeridos');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Verificar si el usuario ya existe
    const users = JSON.parse(localStorage.getItem('cya_users') || '[]');
    if (users.some((u: any) => u.email === email)) {
      throw new Error('Este email ya está registrado');
    }

    // Crear nuevo usuario
    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      email,
      name,
      password // En producción, esto debería estar hasheado
    };

    users.push(newUser);
    localStorage.setItem('cya_users', JSON.stringify(users));

    // Auto-login después del registro
    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    };

    setUser(userData);
    localStorage.setItem('cya_user', JSON.stringify(userData));
  };

  const resetPassword = async (email: string, newPassword: string) => {
    // Validación básica
    if (!email || !newPassword) {
      throw new Error('Email y contraseña son requeridos');
    }

    if (newPassword.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Buscar y actualizar el usuario
    const users = JSON.parse(localStorage.getItem('cya_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex === -1) {
      throw new Error('El email no está registrado');
    }

    // Actualizar contraseña
    users[userIndex].password = newPassword;
    localStorage.setItem('cya_users', JSON.stringify(users));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cya_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}

export type { AuthContextType };
