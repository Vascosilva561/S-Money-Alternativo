import { createContext, useEffect, useState } from "react";
import { api } from "../api";
import { toast, Toaster } from "sonner";

type IUser = {
    id: string;
    email: string;
    phone_number: string;
    login: string;
    name: string;
    auth_token: string;
    active: boolean;
    account_type: string;
    created_at: string;
    updated_at: string;
    last_login_at: string;
    provincia: string | null;
    municipio: string | null;
    tel_empresa: string | null;
    bi_number: string | null;
    address: string | null;
    photo: string | null
}


type LoginParams = {
    login: string,
    password: string
}

type IAuthContext = {
    statusErroAuth: boolean;
    setStatusErroAuth: React.Dispatch<React.SetStateAction<boolean>>;
    user: IUser | null;
    loading: boolean;
    login: (props: LoginParams) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

export const AuthContext = createContext<IAuthContext>({
    login: async () => { },
    logout: () => { },
    isAuthenticated: false,
    loading: true,
    user: null,
    statusErroAuth: false,
    setStatusErroAuth: () => { }
})

export function AuthProvider({ children }: any) {
    const [statusErroAuth, setStatusErroAuth] = useState(false);
    const storedToken = localStorage.getItem("tokenSomoney");
    const storedUser = localStorage.getItem("userSomoney");

    const [isAuthenticated, setIsAuthenticated] = useState(!!storedToken);
    const [user, setUser] = useState<IUser | null>(
        storedUser ? JSON.parse(storedUser) : null
    );
    const [loading, setLoading] = useState(true); // começa true

    async function login({ login, password }: LoginParams) {
        try {
            const { data, status } = await api.post(
                "/front/sessions/manager-login",
                { login, password }
            );

            if (status === 200 || status === 201) {
                api.defaults.headers.common = {
                    Authorization: `Bearer ${data.auth_token}`,
                };
                api.defaults.headers.common = {
                    Authorization: `Bearer ${data.auth_token}`,
                };

                localStorage.setItem("userSomoney", JSON.stringify(data));
                localStorage.setItem("tokenSomoney", data.auth_token);
                localStorage.setItem("refreshToken-somoney-backoffice", data.refresh_token);
                
                window.dispatchEvent(new Event("auth:login-sucess"));

                setUser(data);
                setIsAuthenticated(true);
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        }
    }
    function logout() {
        localStorage.removeItem("userSomoney");
        localStorage.removeItem("tokenSomoney");
        localStorage.removeItem("refreshToken-somoney-backoffice");

        setUser(null);
        setIsAuthenticated(false);
    }

    async function readSession() {
        const token = localStorage.getItem("tokenSomoney");
        const userData = localStorage.getItem("userSomoney");

        if (token && userData) {
            api.defaults.headers.common = { Authorization: `Bearer ${token}` };
            api.defaults.headers.common = { Authorization: `Bearer ${token}` };

            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }

        setLoading(false); // só libera a tela aqui
    }

    useEffect(() => {
        readSession();
    }, [isAuthenticated]);

    useEffect(() => {
        const handleLogout = () => {
            logout();
        };
        const handleToastLogout = () => {
            toast.warning("Sua sessão expirou!");
        }

        window.addEventListener("auth:logout", handleLogout);
        window.addEventListener("auth:toast-logout", handleToastLogout);
        //toast-logout

        return () => {
            window.addEventListener("auth:toast-logout", handleToastLogout);
            window.removeEventListener("auth:logout", handleLogout);
        };
    }, []);

    useEffect(() => {
        const handleLoginSucess = () => {
            toast.success("Bem Vindo(a) à Sómoney", {
                position: "top-center"
            });
        };

        window.addEventListener("auth:login-sucess", handleLoginSucess);

        return () => {
            window.removeEventListener("auth:login-sucess", handleLoginSucess);
        };

    }, []);


    return (
        <AuthContext.Provider
            value={{
                statusErroAuth,
                setStatusErroAuth,
                isAuthenticated,
                user,
                loading,
                login,
                logout,
            }}
        >
            <Toaster />
            {children}

        </AuthContext.Provider>
    );
}

