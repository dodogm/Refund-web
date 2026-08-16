
import {Routes, Route } from "react-router";

import { AppLayout } from "../components/AppLayout";

import { Dashboard } from "../pages/Dashbord";
import { NotFound } from "../pages/Not-found";
import { Refund } from "../pages/Refund";
import { Confirm } from "../pages/Confirm";

export function ManagerRoutes() {
    return (
        <Routes>
            <Route path="/" element= {<AppLayout/>}>
            <Route path="/" element= {<Dashboard/>} />
            <Route path="/refund/:id" element= {<Refund/>} />
            </Route>

            <Route path="*" element= {<NotFound/>}></Route>
        </Routes>
    )
}