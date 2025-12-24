import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // hydrate from localStorage
    useEffect(() => {
        const raw = localStorage.getItem("tiq_user");
        if (raw) {
            try { setUser(JSON.parse(raw)); } catch { }
        }
    }, []);

    // persist to localStorage
    useEffect(() => {
        if (user) localStorage.setItem("tiq_user", JSON.stringify(user));
        else localStorage.removeItem("tiq_user");
    }, [user]);

    const login = (email) => setUser({ email });
    const signup = (email) => setUser({ email });
    const logout = () => setUser(null);

    const value = useMemo(() => ({
        user, isAuthed: !!user, login, signup, logout
    }), [user]);

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
    return ctx;
}
