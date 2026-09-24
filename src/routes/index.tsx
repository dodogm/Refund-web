import { BrowserRouter } from "react-router";
import { useContext } from "react";

import { useAuth } from "../hooks/useAuth";

import { Loading } from "../components/Loading";

import { AuthRoutes } from "./auth-routes";
import { ManagerRoutes } from "./ManagerRoutes";
import { EmployeeRoutes } from "./employee-routes";


export function Routes() {

    const {session, isLoading} = useAuth()

    function Route() {
        switch (session?.user.role) {
            case "employee":
                return <EmployeeRoutes/>

                case "manager":
                return <ManagerRoutes/>
        
            default:
                return<AuthRoutes/>;
        }
    }

    if (isLoading) {
        return <Loading/>
    }

    return (
        <BrowserRouter>
        <Route />
        </BrowserRouter>
    )
}
