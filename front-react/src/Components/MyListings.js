import React, { useEffect, useState } from "react";
import { setConstraint } from "../constraints";
import Navbar from "../Components/Navbar";
import "../css/item_card.css";
import "../css/mylisting.css";
import Axios from "axios";
import { Card, Col, Container, Row, Badge } from "react-bootstrap";

export default function Feed() {
  setConstraint(true);
  const [item, setitem] = useState("");
  const [Found_item, setFound_item] = useState();
  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };
    return (
      <p className="text">
        {isReadMore ? text.slice(0, 15) : text}
        <span onClick={toggleReadMore} className="read-or-hide">
          {isReadMore ? "...." : " show less"}
        </span>
      </p>
    );
  };
  useEffect(() => {
    Axios({
      url: `http://localhost:5000/mylistings/${
        JSON.parse(localStorage.getItem("user"))._id
      }`,
      method: "GET",
    })
      .then((response) => {
        let data = response.data.item;
        let items = [];
        let Found_items = [];
        data.reverse().map((item) => {
          let created_date = new Date(item.createdAt);
          let createdAt =
            created_date.getDate() +
            "/" +
            created_date.getMonth() +
            "/" +
            created_date.getFullYear() +
            " " +
            created_date.getHours() +
            ":" +
            created_date.getMinutes();
          items.push(
            <a href={`/${item.name}?cid=${item._id}&type=${item.type}/true`}>
              <Col key={item.name} style={{ marginTop: "2%" }} md={3}>
                <Card bsPrefix="item-card" style={{ maxHeight: "700px" }}>
                  <Card.Img
                    variant="top"
                    src={`https://ensetinnova.s3.amazonaws.com/${item.itemPictures[0].img}`}
                  />
                  <Card.Body bsPrefix="card-body">
                    {item.status ? (
                      <>
                        {" "}
                        <Badge pill variant="success">
                          Actif
                        </Badge>
                      </>
                    ) : (
                      <>
                        <Badge pill variant="secondary">
                          Inactif
                        </Badge>
                      </>
                    )}
                    <Card.Title>Article :{item.name}</Card.Title>
                    {item.description ? (
                      <Card.Text>
                        Description :<ReadMore>{item.description}</ReadMore>
                      </Card.Text>
                    ) : (
                      ""
                    )}
                    <Card.Text>Type : {item.type}</Card.Text>
                    <Card.Text>Créé à : {createdAt}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </a>
          );
        });
        setitem(items);
        setFound_item(Found_items);
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="listing-title">
        <h2>Mes annonces</h2>
        <div className="title-border"></div>
      </div>
      <div>
        <Container fluid>
          <Row>{item}</Row>
        </Container>
      </div>
    </div>
  );
}
