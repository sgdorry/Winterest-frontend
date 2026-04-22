import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored && stored.id) return stored;
  } catch {
    localStorage.removeItem("user");
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  function login(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  function updateUser(partialUserData) {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const nextUser = { ...currentUser, ...partialUserData };
      localStorage.setItem("user", JSON.stringify(nextUser));
      return nextUser;
    });
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
