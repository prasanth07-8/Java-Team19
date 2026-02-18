import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for existing token and fetch user
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const response = await api.get('/auth/me');
                    // Backend returns ApiResponse<JwtResponse>
                    setUser(response.data.data);
                } catch (error) {
                    console.error("Auth check failed:", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();

        // Listen for global unauthorized events
        const handleUnauthorized = () => {
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [navigate]);

    const login = async (username, password) => { // username is email here
        try {
            // Backend endpoint is /auth/signin
            const response = await api.post('/auth/signin', { email: username, password });
            // Response structure: { success: true, message: "...", data: { token, ... } }
            const { token, ...userData } = response.data.data;

            localStorage.setItem('token', token);
            setUser(userData);

            navigate('/');
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (formData) => {
        try {
            // Backend endpoint is /auth/signup
            // formData should match SignupRequest: name, email, password, phone, department, role
            await api.post('/auth/signup', formData);
            return true;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
