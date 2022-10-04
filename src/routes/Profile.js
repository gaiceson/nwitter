import { authService } from "fbase";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/"); // 로그아웃 이후 경로처리
    };

    return (
        <>
        <button onClick={onLogOutClick}>Log Out</button>
        </>
    );

};

export default Profile;