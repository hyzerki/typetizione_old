import React, { useEffect, useLayoutEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginForm from "../../../components/LoginForm";
import RegisterForm from "../../../components/RegisterForm";
import AuthService from "../../../service/authService";

function AuthPage(props: any) {
    const navigate = useNavigate();

    useLayoutEffect(() => {
        AuthService.checkAuth().then(res=>{
            if(res){
                navigate("/");
            }
        })
    }, []);

    return (
        <div className="h-full bg-neutral-800 flex align-middle items-center justify-center">
            <div className="h-2/5 w-3/12 ">
                <Routes>
                    <Route index element={<LoginForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                </Routes>

            </div>
        </div>
    );
}

export default AuthPage;