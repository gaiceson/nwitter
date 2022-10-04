import { authService, firebaseInstance } from 'fbase';
import { useState } from 'react';

const Auth = () => {
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
            console.log(data);
        } catch (err) {
            //console.log(err);
            setError(err.message);
        }
    };

    // 토클 버튼 처리.
    const toggleAccount = () => setNewAccount((prev) => !prev);
    // 소셜 로그인
    const onSocialClick = async (evnet) => {
        //console.log(evnet.target.name);
        const {
            target: {name},
        } = evnet;
        let provider;
        if (name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if ( name === "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }

        const data = await authService.signInWithPopup(provider);
        console.log(data);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    required 
                    value={email} 
                    onChange={onChange}
                    />
                <input 
                    name="password"
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={password} 
                    onChange={onChange}
                    />
                <input type="submit" value={newAccount?"Create Account" : "Log In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>
                {newAccount ? "Sign In" : "Create Acount"}
            </span>
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github" >Continue with Github</button>
            </div>
        </div>
    );
}

export default Auth;