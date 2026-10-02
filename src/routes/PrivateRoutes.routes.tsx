import { DefaultLayout } from "@/components/layout";
import { Spinner } from "@/components/utils/spinner";
import { AuthContext } from "@/context/auth";
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";



const PrivateRoute: React.FC = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    // if(checkDevice&&checkDevice()&&width!<=1028){

    //     return <Navigate to="/dispositivo-movel" />;

    //    }else{
    //        if(!loading){
    //            return isAuthenticated ? <DefaultLayout /> : <Navigate to="/login" />;
    //        }
    //    }

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center text-[#143163] space-x-2">
                <Spinner color="#143163" width="60" height="60" /><p>A carregar...</p>
            </div>
        );
    }
    return isAuthenticated ?
        <DefaultLayout>
            <Outlet />
        </DefaultLayout> : <Navigate to="/login" />;

};

export default PrivateRoute;