import { dbService, storageService } from "fbase";
import { useEffect, useState } from "react";
import Nweet from "componets/Nweet";
import { v4 as uuidv4 } from 'uuid';

const Home = ( { userObj }) => {
    //console.log(userObj);
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    // DB Read
    // const getNweets = async () => {
    //      //get은 QuarySnapshot을 return
    //     const dbNweets = await dbService.collection("nweets").get();
    //     dbNweets.forEach((document) => {
    //         const nweetObject = { ...document.data(), id: document.id, };
    //         setNweets((prev) => [nweetObject, ...prev]);
    //     });
    // };

    useEffect(() => {
        //getNweets();
        dbService.collection("nweets").onSnapshot((snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        })
    }, []);

    //console.log(nweets);

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        
        // 이미지 정보 파일로드 했을때만
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url"); // DB 저장
            attachmentUrl = await response.ref.getDownloadURL();
        }        

        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        });
        setNweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: {value},
        } = event;
        setNweet(value);
    };

    // 첨부파일 정보 출력
    const onFileChange = (event) => {
        //console.log(event.target.files);
        const { 
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            //console.log(finishedEvent);
            const { 
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onClearAttachment = () => setAttachment("");

    return (
        <>
        <form onSubmit={onSubmit}>
            <input
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
            />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type="submit" value="Nweet" />
            { // 이미지 로드
            attachment && (
                <div>
                <img src={attachment} width="50px" height="50px" />
                <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
        <div>
            { nweets.map((nweet) => (
                <Nweet key={nweet.id} nweetObj={nweet}
                isOwner={nweet.creatorId === userObj.uid} />
            ))}
        </div>
        </>
    );
};

export default Home;