import "./App.css";

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink as Link,
  Redirect
} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import { Nav } from "react-bootstrap";

import Home from "./routes/Home";
import About from "./routes/About";
import Contact from "./routes/Contact";
import ExternalLinks from "./components/ExternalLinks";

function App() {
  return (
    <React.Fragment>
      <Router basename={process.env.PUBLIC_URL}>
        <Navbar fixed="top" bg="light" expand="md">
          <Navbar.Brand as={Link} to="/">
            Jacob Helfgot
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav.Link
              exact
              as={Link}
              to="/"
              className="text-primary"
              activeClassName="font-weight-bold"
            >
              Home
            </Nav.Link>
            <Nav.Link
              exact
              as={Link}
              to="/about"
              className="text-primary"
              activeClassName="font-weight-bold"
            >
              About Me
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contact"
              className="text-primary"
              activeClassName="font-weight-bold"
            >
              Contact Me
            </Nav.Link>
          </Navbar.Collapse>
        </Navbar>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
        <div>
          <Navbar bg="light" fixed="bottom" expand="sm">
            <div style={{ margin: "auto" }}>
              <ExternalLinks />
            </div>
          </Navbar>
        </div>
      </Router>
    </React.Fragment>
  );
}

export default App;
