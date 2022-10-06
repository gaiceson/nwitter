import { useEffect, useState } from 'react';
import AppRouter from "componets/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  // 트윗의 수정, 삭제를 위해
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        //setIsLoggedIn(user); //--> 삭제
        //setUserObj(user);
        setUserObj({
          uid: user.uid,
          displayName: user.displayName,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(false);
      }
      setInit(true);

    });
  }, []);

  const refreshUser = () => {
    //setUserObj(authService.currentUser); //--> 삭제
    const user = authService.currentUser;
    setUserObj({
      uid: user.uid,
      displayName: user.displayName,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <>
    {init ? (<AppRouter refreshUser={refreshUser} isLoggin={Boolean(userObj)} userObj={userObj}/> 
    ) : ( "initializing..." )}
    </>
  );
}

export default App;
