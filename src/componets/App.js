import { useEffect, useState } from 'react';
import AppRouter from "componets/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggin, setIsLoggedIn] = useState(false);
  // 트윗의 수정, 삭제를 위해
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(user);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);

    });
  }, []);

  return (
    <>
    {init ? (<AppRouter isLoggin={isLoggin} userObj={userObj}/> 
    ) : ( "initializing..." )}
    <footer>&copy; {new Date().getFullYear()} Nwitter </footer>
    </>
  );
}

export default App;
