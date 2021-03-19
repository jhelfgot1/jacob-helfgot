import React from "react";

import { Link } from "react-router-dom";
import Headshot from "../components/Headshot";
import Content from "../components/Content";
const Home = () => {
  const headerContent = "Hi! Welcome to my website...";
  const pageContent = [
    <p>
      My name is Jacob and I'm a full-stack software engineer. Head on over to
      the <Link to="/about">"About Me"</Link> page if you want a little more
      info on who I am and what I'm all about.
    </p>,
    <p>
      I do appreciate you stopping by. I just recently started putting this site
      together, so forgive how barren it is for the time-being. My plan is to
      use this site as a sandbox to explore new design techniques, so checkback
      periodically to see how things are progressing!
    </p>,
    <p>
      In the coming weeks I'll be putting some of my past projects on display,
      further building out the site, and making the whole thing a bit more
      snazzy.
    </p>
  ];
  return (
    <React.Fragment>
      <Content headerContent={headerContent} pageContent={pageContent} />
    </React.Fragment>
  );
};

export default Home;
