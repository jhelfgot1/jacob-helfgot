import React from "react";

const Article = ({ headerContent, textContent }) => {
  return (
    <div>
      <h3>{headerContent}</h3>
      <p>{textContent}</p>
    </div>
  );
};

export default Article;
