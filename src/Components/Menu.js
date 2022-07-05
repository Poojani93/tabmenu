import React, { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import { Container, Nav, Navbar, NavDropdown, Card } from "react-bootstrap";
import axios from "axios";

const Menu = () => {
  const [section, setSection] = useState([]);
  const [sectionName, setSectionName] = useState("");
  console.log(sectionName);

  useEffect(() => {
    axios
      .get("http://localhost:5002/section")
      .then((res) => {
        console.log(res);
        setSection(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        style={{ padding: "1.5rem" }}
      >
        <Container>
          <Navbar.Brand href="#home">
            <h3>Power Consumption</h3>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Section" id="collasible-nav-dropdown">
                {section.slice(17).map((section) => {
                  return (
                    <>
                      <NavDropdown.Item href="/">
                        {section.name}
                      </NavDropdown.Item>
                    </>
                  );
                })}
                {section.slice(0, 17).map((section) => {
                  return (
                    <>
                      <NavDropdown.Item href={"/section" + section.id}>
                        {section.name}
                      </NavDropdown.Item>
                    </>
                  );
                })}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Menu;
