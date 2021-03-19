import React from "react";

import Content from "../components/Content";

const Contact = () => {
  const pageContent = [
    <p>Reach out to me through any of the following channels:</p>,
    <ul>
      <li>
        <a href="mailto:jhelfgot1@gmail.com" target="_blank">
          Email Me :)
        </a>
      </li>
      <li>
        <a href="https://www.linkedin.com/in/jacob-helfgot-b2b018127/">
          LinkedIn
        </a>
      </li>
    </ul>,
    <p>
      Also, take a look at my{" "}
      <a href="https://github.com/jhelfgot1">github page</a> if you'd like.
    </p>
  ];
  return <Content headerContent="Get in touch!" pageContent={pageContent} />;
};

export default Contact;
