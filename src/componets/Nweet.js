import { faCodepen, faCpanel, faPennyArcade, faPerbyte } from "@fortawesome/free-brands-svg-icons";
import { faArrowAltCircleLeft, faBookmark, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";
import { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text); 

    // 삭제하기
    const onDeleteClick = async () => {
        const ok = window.confirm('삭제하시겠습니까?');
        //console.log(ok);
        if (ok) {
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            if (nweetObj.attachmentUrl !== "") {
                await storageService.refFromURL(nweetObj.attachmentUrl).delete();
            }
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    // 편집하기
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewNweet(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        //console.log(nweetObj.id, newNweet);
        await dbService.doc(`nweets/${nweetObj.id}`).update({ text: newNweet});
        setEditing(false);
    };

    return (
        <div className="nweet" >
            {editing ? (
                <>
                <form onSubmit={onSubmit} className="container nweetEdit">
                    <input onChange={onChange} value={newNweet} required 
                    placeholder="Edit your nweet" autoFocus className="formInput"/>
                    <input type="submit" value="Update Nweet" className="formBtn"/>
                </form>
                <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                <h4>{nweetObj.text}</h4>
                {nweetObj.attachmentUrl && (
                    <img src={nweetObj.attachmentUrl} width="50px" height="50px" />
                ) }
                { isOwner && (
                <div className="nweet__actions">
                <span onClick={onDeleteClick}><FontAwesomeIcon icon={faTrashAlt} /></span>
                <span onClick={toggleEditing}><FontAwesomeIcon icon={faBookmark} /></span> 
                </div>)
                }
                </>
            )}
        </div>
    );
}

export default Nweet;