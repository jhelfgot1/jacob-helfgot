import "./App.css";

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink as Link
} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import Home from "./routes/Home";
import About from "./routes/About";
import Contact from "./routes/Contact";
import ComputerGraphics from "./routes/ComputerGraphics";
import ExternalLinks from "./components/ExternalLinks";

function App() {
  return (
    <div classname="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Navbar fixed="top" bg="dark" variant="dark" expand="md">
          <Navbar.Brand as={Link} to="/">
            Jacob Helfgot
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav.Link
              exact
              as={Link}
              to="/"
              className="link"
              activeClassName="font-weight-bold"
            >
              Home
            </Nav.Link>
            <Nav.Link
              exact
              as={Link}
              to="/about"
              className="link"
              activeClassName="font-weight-bold"
            >
              About Me
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/contact"
              className="link"
              activeClassName="font-weight-bold"
            >
              Contact Me
            </Nav.Link>
            <NavDropdown
              className="link"
              title="Academic Projects"
              id="past-projects-dropdown"
            >
              <NavDropdown.Item as={Link} to="/cg">
                Computer Graphics
              </NavDropdown.Item>
            </NavDropdown>
          </Navbar.Collapse>
        </Navbar>
        <Switch>
          <div className="pageContent">
            <Route path="/about">
              <About />
            </Route>
            <Route path="/contact">
              <Contact />
            </Route>
            <Route path="/cg">
              <ComputerGraphics />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </div>
        </Switch>

        <div>
          <Navbar bg="light" fixed="bottom" expand="sm">
            <div style={{ margin: "auto" }}>
              <ExternalLinks />
            </div>
          </Navbar>
        </div>
      </Router>
    </div>
  );
}

export default App;
