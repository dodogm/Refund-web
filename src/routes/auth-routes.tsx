import { Routes, Route } from "react-router";

import { AuthLayout } from "../components/AuthLayout";

import { SignIn } from "../pages/Sign-in";
import {SignUp} from "../pages/Sign-up";
import { NotFound } from "../pages/Not-found";

export function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AuthLayout />} >
            <Route path="/" element={<SignIn />} />
             <Route path="/signup" element={<SignUp />} />
              </Route>

              <Route path="*" element={<NotFound/>} />
        </Routes>
    )
}