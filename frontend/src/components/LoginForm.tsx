import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import authService from "../service/authService";
import { AxiosError, HttpStatusCode } from "axios";

function LoginForm(props: any) {

    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loginError, setLoginError] = React.useState("");
    const navigator = useNavigate();


    const onSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await authService.login(userName, password);
            navigator("/");
        } catch (error: any) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    setLoginError(error.response.data.message);
                    return;
                }
                setLoginError(error.message);
            }

        }
    }


    return (
        <div className="border rounded-xl p-5 bg-neutral-700">
            <form onSubmit={onSubmit}>
                <div className="mb-5">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="authFormUsername">Имя пользователя</label>
                    </div>
                    <div>
                        <input id="authFormUsername" type="text" onChange={(e) => { setUserName(e.target.value) }} value={userName} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                </div>
                <div className="mb-5">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="authFormPassword">Пароль</label>
                    </div>
                    <div>
                        <input id="authFormPassword" type="password" onChange={(e) => { setPassword(e.target.value) }} value={password} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
                    </div>
                </div>
                <React.Suspense fallback={<div>Загрузка</div>}>
                    {
                        loginError ?
                            <div className="mb-5 rounded-md p-3 bg-red-900/25 border border-red-500 mt-2 text-sm text-red-600 dark:text-red-500 font-medium">
                                {loginError}
                            </div>
                            :
                            null
                    }
                </React.Suspense>
                <div className="flex flex-row">
                    <div>
                        <input value="Войти" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" type="submit" />
                    </div>
                    <div>
                        <Link to='/auth/register'>К регистрации</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;