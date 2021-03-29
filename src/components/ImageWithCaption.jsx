import React from "react";
import "./ImageWithCaption.css";

const ImageWithCaption = ({ imageSrc, caption }) => {
  return (
    <div className="imageWithCaption">
      <img src={imageSrc} fluid responsive />
      {caption ? <p>{caption}</p> : null}
    </div>
  );
};

export default ImageWithCaption;
