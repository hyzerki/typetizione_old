import React from "react";
import AuthenticationForm from "../../components/AuthenticationForm";

function LoginPage(props: any) {





    return (
        <div className="h-full bg-neutral-800 flex align-middle items-center justify-center">
            <div className="h-2/5 w-3/12 ">
                <AuthenticationForm />
            </div>
        </div>
    );
}

export default LoginPage;