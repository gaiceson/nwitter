import { useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

import imageCompression from "browser-image-compression"; // 이미지 용량 줄이기

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    if (nweet === "") {
      return;
    }
    let attachmentUrl = "";

    // 이미지 정보 파일로드 했을때만
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);

      const response = await attachmentRef.putString(attachment, "data_url"); // DB 저장
      attachmentUrl = await response.ref.getDownloadURL();

      //파일 경로 참조 만들기
      //   const attachmentfileRef = ref(
      //     storageService,
      //     `${userObj.uid}/${uuidv4()}`
      //   );

      //   //storage 참조 경로로 파일 업로드 하기
      //   await uploadString(attachmentfileRef, attachment, "data_url");

      //   //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
      //   attachmentUrl = await getDownloadURL(ref(attachmentfileRef));
    }

    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;

    setNweet(value);
  };

  // 이미지 압축
  const compressImage = async (image) => {
    try {
      // 이미지 resize 옵션 설정 ( 최대 width를 100px로 지정 )
      const options = {
        maxSizeMb: 1,
        maxWidthOrHeight: 100,
      };
      return await imageCompression(image, options);
    } catch (e) {
      console.log(e);
    }
  };

  // 이미지 출력 및 URL로 바꾸는 로직
  const onFileChange = async (event) => {
    //console.log(event.target.files);
    const theFile = event.target.files[0]; // 파일 1개만 첨부
    const compressedImage = await compressImage(theFile); // 이미지 압축

    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      //console.log(finishedEvent);
      //   const {
      //     currentTarget: { result },
      //   } = finishedEvent;
      //console.log(finishedEvent.currentTarget.result);
      setAttachment(finishedEvent.currentTarget.result);
    };

    // 사진 선택 버그 수정
    //reader.readAsDataURL(theFile);
    if (Boolean(theFile)) {
      reader.readAsDataURL(compressedImage);
    }
  };

  const onClearAttachment = () => setAttachment("");

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />

      {
        // 이미지 추가가 되었다면 이미지 뷰어 및 하단에 삭제 버튼 처리
        attachment && (
          <div className="factoryForm__attachment">
            <img src={attachment} style={{ backgroundImage: attachment }} />
            <div className="factoryForm__clear" onClick={onClearAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )
      }
    </form>
  );
};

export default NweetFactory;
