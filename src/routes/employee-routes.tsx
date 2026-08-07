import { Routes, Route } from "react-router";

import { Refund } from "../pages/Refund";
import { NotFound } from "../pages/Not-found";
import { Confirm } from "../pages/Confirm";

import { AppLayout } from "../components/AppLayout";

export function EmployeeRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />} >
            <Route path="/" element={<Refund />} />
            <Route path="/confirm" element={<Confirm />} />
            
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes >
    )
}