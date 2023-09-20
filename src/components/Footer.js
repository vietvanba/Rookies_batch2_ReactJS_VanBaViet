import React, { useEffect, useState } from "react";
import { Col, Jumbotron, Media, Row } from "reactstrap";
import "../css/Footer.css";
import zalo from "../img/zalo.svg";
import fb from "../img/fb.svg";
import youtube from "../img/youtube.svg";

export default function Footer() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [date, setDate] = useState(new Date().toLocaleDateString());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setDate(new Date().toLocaleDateString());
    });
  });
  return (
    <div className="Footer">
      <Jumbotron>
        <Row>
          <Col md={10}>
            <h2 className="display-3">Flying Books Store</h2>
            <p className="lead">
              This is a simple project, from 'The Rookies Batch 2'.
            </p>
          </Col>
          <Col md={2} style={{ textAlign: "center" }}>
            <p className="lead">Contact with me</p>
            <Row>
              <Col md={4}>
                <a href="https://fb.com/baviet19">
                  <Media src={fb}></Media>
                </a>
              </Col>
              <Col md={4}>
                <a href="https://www.youtube.com/channel/UC7Os8kNpz_f6p5OmRixUtvw">
                  <Media src={youtube}></Media>
                </a>
              </Col>
              <Col md={4}>
                <a href="https://zalo.me/0332796818">
                  <Media
                    src={zalo}
                    style={{ maxHeight: "1.5rem", maxWidth: "1.5rem" }}
                  ></Media>
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
        <hr className="my-2" />
        <p>If you have any questions, please contact <a href="mailto:baviet19@gmail.com">baviet19@gmail.com</a></p>
      </Jumbotron>
      <div style={{ textAlign: "center" }}>
          <div>The current time is :</div>
        {time} {date}
      </div>
    </div>
  );
}
