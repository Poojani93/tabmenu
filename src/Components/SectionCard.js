import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import axios from "axios";

const SectionCard = () => {
  const [section, setSection] = useState([]);

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
    <div>
      <Container>
        <Row>
        {section.slice(17).map((section) => {
            return (
              <>
                <Col xs={4} md={3} style={{padding: "0.5rem"}}>
                <a href={"/section"+section.id} style={{textDecoration: "none", color: "inherit"}}>
                  <Card style={{height: "20vh", padding: "0.5rem", color: "white", backgroundColor: "#2f3635"}}>
                    <Card.Body><h3 style={{position: "relative", top: "25%", textAlign: "center"}}>Overall Energy</h3></Card.Body>
                  </Card>
                  </a>
                </Col>
              </>
            );
          })}
          {section.slice(0,17).map((section) => {
            return (
              <>
                <Col xs={4} md={3} style={{padding: "0.5rem"}}>
                <a href={"/section"+section.id} style={{textDecoration: "none", color: "inherit"}}>
                  <Card style={{height: "20vh", padding: "0.5rem", color: "white", backgroundColor: "#2f3635"}}>
                    <Card.Title >Section: {section.id}</Card.Title>
                    <Card.Body>Section infomation: {section.name}</Card.Body>
                  </Card>
                  </a>
                </Col>
              </>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default SectionCard;
