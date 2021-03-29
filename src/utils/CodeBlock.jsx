import React from "react";
import "./codeblock.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const CodeBlock = ({ codeSnippet }) => {
  return (
    <div className="codeblock">
      <SyntaxHighlighter
        customStyle={{ fontSize: ".6em" }}
        showLineNumbers={true}
        language="cpp"
      >
        {codeSnippet}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
