import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
  isSignedIn: boolean;
  signIn: (token: string, username: string, email: string) => void;
  signOut: () => void;
  setIsSignedIn: (value: boolean) => void;
  username: string | null;
  email: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');

    if (token && storedUsername && storedEmail) {
      setIsSignedIn(true);
      setUsername(storedUsername);
      setEmail(storedEmail);
    }
  }, []);

  const signIn = (token: string, username: string, email: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);

    setIsSignedIn(true);
    setUsername(username);
    setEmail(email);
  };

  const signOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');

    setIsSignedIn(false);
    setUsername(null);
    setEmail(null);

    window.location.href = '/signin';
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isSignedIn, 
        signIn, 
        signOut, 
        setIsSignedIn,
        username,
        email
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};