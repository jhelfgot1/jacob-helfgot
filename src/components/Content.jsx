import React from "react";

const Content = ({ headerContent, pageContent }) => {
  return (
    <div style={{ margin: "60px" }} className="overflow-auto ">
      <h1>{headerContent}</h1>
      <div className="mt-2 mr-5">
        {pageContent.map(pageContentElement => (
          <div>{pageContentElement}</div>
        ))}
      </div>
    </div>
  );
};

export default Content;
