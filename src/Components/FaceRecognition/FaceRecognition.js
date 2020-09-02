import React from "react";
import "./faceRecognition.css";

const FaceRecognition = ({ imageUrl, faceBox }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          width="550px"
          height="auto"
        />
        {faceBox.map((styled, i) => {
          return (
            <div
              key={`face${i}`}
              className="bounding-box"
              style={{
                top: styled.topRow,
                right: styled.rightCol,
                bottom: styled.bottomRow,
                left: styled.leftCol,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default FaceRecognition;
