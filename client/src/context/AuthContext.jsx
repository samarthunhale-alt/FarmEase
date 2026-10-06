import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { AuthAPI } from '../services/endpoints.js';
import { TOKEN_KEY } from '../services/api.js';

const AuthCtx = createContext(null);

export const useAuth = () => useContext(AuthCtx);

export const homeFor = (role) => {
  if (role === 'farmer') return '/farmer';
  if (role === 'buyer') return '/buyer';
  if (role === 'admin') return '/admin';
  return '/';
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(
    !!localStorage.getItem(TOKEN_KEY)
  );

  const clear = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // Check logged-in user
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setLoading(false);
      return;
    }

    AuthAPI.me()
      .then((res) => {
        setUser(res.user);
      })
      .catch(clear)
      .finally(() => {
        setLoading(false);
      });
  }, [clear]);

  // Logout event
  useEffect(() => {
    window.addEventListener('Farmer:logout', clear);

    return () => {
      window.removeEventListener('Farmer:logout', clear);
    };
  }, [clear]);

  // Login / Register
  const finish = (res) => {
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
    return res.user;
  };

  const login = async (body) => {
    const res = await AuthAPI.login(body);
    return finish(res);
  };

  const register = async (body) => {
    const res = await AuthAPI.register(body);
    return finish(res);
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
    } catch {
      // Ignore logout error
    }

    clear();
  };

  return (
    <AuthCtx.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}