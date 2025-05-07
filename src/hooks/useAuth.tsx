
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export interface User {
  id: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  approved: boolean;
  age: number;
  birthdate: string;
  familyId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (nationalId: string, password: string) => Promise<void>;
  register: (userData: RegistrationData) => Promise<void>;
  logout: () => void;
}

interface RegistrationData {
  nationalId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  includeFamily: boolean;
}

// Mock Data - replace with actual API calls when connected to backend
const mockUsers: User[] = [
  {
    id: '1',
    nationalId: '12345678901',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    isAdmin: true,
    approved: true,
    age: 35,
    birthdate: '1988-05-15',
    familyId: '101'
  },
  {
    id: '2',
    nationalId: '98765432109',
    firstName: 'Regular',
    lastName: 'User',
    email: 'user@example.com',
    isAdmin: false,
    approved: true,
    age: 28,
    birthdate: '1995-10-23',
    familyId: '102'
  },
  {
    id: '3',
    nationalId: '11223344556',
    firstName: 'Pending',
    lastName: 'User',
    email: 'pending@example.com',
    isAdmin: false,
    approved: false,
    age: 42,
    birthdate: '1980-12-03'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function - replace with actual API call
  const login = async (nationalId: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(user => user.nationalId === nationalId);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      if (!foundUser.approved) {
        throw new Error('Your account is pending approval');
      }

      // In real implementation, verify password
      
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.firstName}!`,
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock registration function - replace with actual API call
  const register = async (userData: RegistrationData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.some(user => user.nationalId === userData.nationalId)) {
        throw new Error('A user with this National ID already exists');
      }
      
      if (mockUsers.some(user => user.email === userData.email)) {
        throw new Error('A user with this email already exists');
      }
      
      // Calculate age based on national ID (simplified)
      const birthYear = 2000 - (parseInt(userData.nationalId.substring(0, 2)));
      const birthMonth = parseInt(userData.nationalId.substring(2, 4));
      const birthDay = parseInt(userData.nationalId.substring(4, 6));
      
      const birthdate = `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`;
      const today = new Date();
      const birth = new Date(birthdate);
      const age = today.getFullYear() - birth.getFullYear() - 
        (today.getMonth() < birth.getMonth() || 
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0);
      
      const newUser: User = {
        id: String(mockUsers.length + 1),
        nationalId: userData.nationalId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        isAdmin: false,
        approved: false,  // Require admin approval
        age,
        birthdate
      };
      
      // In a real app, send this data to your backend
      
      toast({
        title: "Registration successful",
        description: "Your account is pending approval by an administrator.",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
