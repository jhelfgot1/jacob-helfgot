import React, { useState } from "react";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import Content from "../components/Content";

const About = () => {
  const headerContent = "Who is this Jacob guy?";
  const popover = (
    <Popover id="popover-basic">
      <Popover.Content>
        If you want to hear more about my work in these roles, reach out! To
        avoid potential security and compliance ramifications, both
        organizations strongly cautioned against being too vocal about our work
        in public forums.
      </Popover.Content>
    </Popover>
  );
  const pageContent = [
    <p>
      Like I said, I'm a software engineer. I've worked at JP Morgan and
      American Express writing back-end applications with C++, Java, and Node,
      and have written front-end apps with React. I love coding, diving into
      interesting problems, automating the annoying stuff, learning new things,
      and working with others to take on big challenges.{" "}
      <OverlayTrigger placement="bottom" overlay={popover}>
        <Badge pill variant="light">
          i
        </Badge>
      </OverlayTrigger>
    </p>,
    <p>
      Solving tough problems gets me out of bed in the morning, and I couldn't
      imagine doing anything else. But it took me awhile to figure that out. I
      tried out a bunch of things in college, from environmental science to
      econcomics. Then I was pretty sure I had it sorted when I switched to
      philosophy.
    </p>,
    <p>
      Then, one day I had a meeting with my advisor and she made an off-hand
      recommendation that I give comp sci a try. I thought, "Sure, why not?"
    </p>,
    <p>
      And the rest was history. Well, almost. I spent the first month of my
      intro CS course banging my head against a wall. Things just were not
      clicking, and I was <strong>not</strong> okay with that.
    </p>,
    <p>
      Then loops started making a bit of sense, then objects, then recursion
      (kind of, that one may have admittedly taken a bit longer). And then I was
      getting through my assignments with what now feels like an acceptable
      amount of head-against-the-wall banging.
    </p>,
    <p>
      Now I'm looking for my next opportunity at an exciting, dynamic company
      where I can get my hands-dirty wearing as many hats as possible. If you're
      looking for a talented and passionate engineer, or know someone who is,
      give me a shout through any of the channels listed{" "}
      <Link to="/contact">here</Link>.
    </p>
  ];
  return <Content headerContent={headerContent} pageContent={pageContent} />;
};

export default About;
