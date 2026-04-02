import { useState, useEffect } from 'react';
import { UserContext } from '../context/Createcontext';

const API_URL = "https://techmarkett.onrender.com";

const UserProvider = ({ children }) => {

    // Load user & token from localStorage on first render
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("techmarket_user");
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("techmarket_token") || null;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sync to localStorage whenever user/token changes
    useEffect(() => {
        if (user && token) {
            localStorage.setItem("techmarket_user", JSON.stringify(user));
            localStorage.setItem("techmarket_token", token);
        } else {
            localStorage.removeItem("techmarket_user");
            localStorage.removeItem("techmarket_token");
        }
    }, [user, token]);

    // Computed
    const isLoggedIn = !!user && !!token;
    const isAdmin = user?.role === "admin";

    // Signup function
    const signup = async (username, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, role: "user" })
            });
            const data = await res.json();

            if (!data.success) {
                setError(data.message);
                setLoading(false);
                return { success: false, message: data.message };
            }

            setLoading(false);
            return { success: true, message: data.message };
        } catch (err) {
            setError("Network error. Please try again.");
            setLoading(false);
            return { success: false, message: "Network error" };
        }
    };

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (!data.success) {
                setError(data.message);
                setLoading(false);
                return { success: false, message: data.message };
            }

            setUser(data.data.user);
            setToken(data.data.token);
            setLoading(false);
            return { success: true, user: data.data.user };
        } catch (err) {
            setError("Network error. Please try again.");
            setLoading(false);
            return { success: false, message: "Network error" };
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        setError(null);
    };

    return (
        <UserContext.Provider value={{
            user,
            token,
            loading,
            error,
            isLoggedIn,
            isAdmin,
            signup,
            login,
            logout,
            setError,
            API_URL
        }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
