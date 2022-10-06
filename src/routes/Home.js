import { dbService } from "fbase";
import { useEffect, useState } from "react";
import Nweet from "componets/Nweet";
import NweetFactory from "componets/NweetFactory";

const Home = ( { userObj }) => {
    const [nweets, setNweets] = useState([]);

    // DB Read
    useEffect(() => {
        dbService.collection("nweets")
            .orderBy("createdAt","desc")
            .onSnapshot((snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        })
    }, []);

    return (
        <>
        <div className="container" style={{
              maxWidth: 890,
              width: "100%",
              margin: "0 auto",
              marginTop: 80,
              display: "flex",
              justifyContent: "center",
            }}>
        <NweetFactory userObj={userObj} />
        <div style={{marginTop:30}}>
            { nweets.map((nweet) => (
                <Nweet key={nweet.id} nweetObj={nweet}
                isOwner={nweet.creatorId === userObj.uid} />
            ))}
        </div>
        </div>
        </>
    );
};

export default Home;