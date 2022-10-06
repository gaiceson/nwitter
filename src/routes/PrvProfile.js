import { authService, dbService } from "fbase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 테스트하기 위해 남겨둔 파일
const PrvProfile = ({userObj}) => {
    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/"); // 로그아웃 이후 경로처리
    };

    const getMyNweets = async () => {
        const nweets = await dbService
        .collection("nweets")
        .where("creatorId", "==", userObj.uid)
        .orderBy("createdAt", "asc")
        .get();

        console.log(nweets.docs.map((doc) => doc.data()));
    };

    // Profile 컴포넌트 랜더링 이후 실행되는 함수
    useEffect(() => {
        getMyNweets();
    }, []);

    return (
        <>
        <button onClick={onLogOutClick}>Log Out</button>
        </>
    );

};

export default PrvProfile;