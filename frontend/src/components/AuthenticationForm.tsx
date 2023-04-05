import React from "react";

function AuthenticationForm(props: any) {

    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");

    return (
        <div>
            <form>
                <div>
                    <div>
                        <label>Имя пользователя</label>
                    </div>
                    <div>
                        <input type="text" onChange={(e) => { setUserName(e.target.value) }} value={userName} />
                    </div>
                </div>
                <div>
                    <div>
                        <label>Пароль</label>
                    </div>
                    <div>
                        <input type="password" onChange={(e) => { setPassword(e.target.value) }} value={password}></input>
                    </div>
                </div>
                <input type="submit" />
            </form>
        </div>
    );
}

export default AuthenticationForm;