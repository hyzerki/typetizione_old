import React from "react";

function RegistrationForm(props: any) {

    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [repeatPassword, setRepeatPassword] = React.useState("");

    const [userNameError, setUserNameError] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const [repeatPasswordError, setRepeatPasswordError] = React.useState("");


    const onSubmit = function(event:React.FormEvent<HTMLInputElement>){
        event.preventDefault();
        fetch({url:""})
    }

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
                    <div>
                        {userNameError}
                    </div>
                </div>
                <div>
                    <div>
                        <label>Пароль</label>
                    </div>
                    <div>
                        <input type="password" onChange={(e) => { setPassword(e.target.value) }} value={password}></input>
                    </div>
                    <div>
                        {passwordError}
                    </div>
                </div>
                <div>
                    <div>
                        <label>Повторите пароль</label>
                    </div>
                    <div>
                        <input type="password" onChange={(e) => { setRepeatPassword(e.target.value) }} value={repeatPassword}></input>
                    </div>
                    <div>
                        {repeatPasswordError}
                    </div>
                </div>
                <div>
                    <input type="submit" onSubmit={onSubmit}/>
                </div>
            </form>
        </div>
    );
}

export default RegistrationForm;