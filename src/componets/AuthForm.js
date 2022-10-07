import { authService, firebaseInstance } from 'fbase';
import { useState } from 'react';

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        //console.log(event.target.name);
        const {
            target: { name, value },
        } = event;

        if ( name === 'email') {
            setEmail(value);
        } else if ( name === 'password') {
            setPassword(value);
        }
    };

    const onSubmit = async (event) => {
        // 페이지 새로고침 문제 해결
        event.preventDefault(); 

        try {
            let data;
            if (newAccount) {
                // create newAccount
                data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                // log in
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            //console.log(data);
        } catch (err) {
            //console.log(err);
            setError(err.message);
        }
    };

    // 토클 버튼 처리.
    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
        <form onSubmit={onSubmit} className="container">
            <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                required 
                value={email} 
                onChange={onChange}
                className="authInput" //--> 스타일적용을 위해 className추가
                />
            <input 
                name="password"
                type="password" 
                placeholder="Password" 
                required 
                value={password} 
                onChange={onChange}
                className="authInput" //--> 스타일적용을 위해 className추가
                />
            <input type="submit" value={newAccount?"Create Account" : "Log In"} className="authInput authSubmit"/>
            {error}
        </form>
        <span onClick={toggleAccount} className="authSwitch">
            {newAccount ? "Sign In" : "Create Acount"}
        </span>
        </>
    );
};

export default AuthForm;