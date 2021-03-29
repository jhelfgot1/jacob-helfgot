import React, { useState } from "react";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import CodeBlock from "../utils/CodeBlock";
import "./project.css";

const Project = ({ projectName, projectDescription, images, codeSnippets }) => {
  const imageElements = [];
  if (images) {
    for (let i = 0; i < images.length; i = i + 2) {
      if (i + 1 < images.length) {
        imageElements.push(
          <Row>
            <Col md={6}>{images[i]}</Col>
            <Col md={6}>{images[i + 1]}</Col>
          </Row>
        );
      } else {
        imageElements.push(
          <Row>
            <Col md={6}>{images[i]}</Col>
          </Row>
        );
      }
    }
  }

  return (
    <div className="mt-3 p-2 border rounded border">
      <h2>{projectName}</h2>
      {projectDescription}
      {imageElements}

      {codeSnippets ? (
        <div>
          <h3 className="mt-3">Code Snippets</h3>
          <Accordion defaultActiveKey="0">
            {codeSnippets.map(({ codeSnippet, name }) => (
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey={name}>
                    {name}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={name}>
                  <CodeBlock name={name} codeSnippet={codeSnippet} />
                </Accordion.Collapse>
              </Card>
            ))}
          </Accordion>
        </div>
      ) : null}
    </div>
  );
};

export default Project;
