import { createContext, useState, useEffect, useCallback } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export default function AuthProvider({children}) {
  
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() =>{
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken) {
            setToken(storedToken);
        }
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }    
    }, []);

    const login = useCallback(async (username, password) => {
        try{
            const res = await fetch('/api/login',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password}),

            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw errorData;
            }

            const data = await res.json();
            setToken(data.access_token);
            setUser(data.user);

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
        } catch(err){
            console.error("Login error:", err);
            throw err;
        }    
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }, []);

    const authContextValue = {
        token,
        user,
        login,
        isAuthenticated: !!token,
        logout
    }
    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}
