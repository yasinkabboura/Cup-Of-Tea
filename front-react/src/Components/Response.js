import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "../css/myresponses.css";
import Axios from "axios";
import { Button, Modal, Badge } from "react-bootstrap";

function Response() {
  const [responses, setResponse] = useState("");
  const [showNumber, setShowNumber] = useState(false);
  const [PhoneNumber, setPhoneNumber] = useState("");
  const handleCloseNumber = () => {
    setShowNumber(false);
  };
  const handleShowNumber = (response) => {
    // console.log("Inside :", response);
    Axios({
      url: `http://localhost:5000/getnumber/${response.belongsTo}`,
      method: "GET",
    })
      .then((response) => {
        // console.log(response.data.Number);
        setPhoneNumber(response.data.Number);
      })
      .finally(() => {
        setShowNumber(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const temp = [];
  useEffect(() => {
    Axios({
      url: `http://localhost:5000/myresponses/${
        JSON.parse(localStorage.getItem("user"))._id
      }`,
      method: "GET",
    })
      .then((res) => {
        // console.log(res)
        const responses = res.data.item;
        // console.log(responses)

        responses.reverse().map((response) => {
          let created_date = new Date(response.createdAt);
          let date =
            created_date.getDate() +
            "/" +
            created_date.getMonth() +
            "/" +
            created_date.getFullYear() +
            " " +
            created_date.getHours() +
            ":" +
            created_date.getMinutes();
          // console.log(response);
          temp.push(
            <div className="responese-card">
              <h5>
                <span className="attributes">ID d'objet:</span>{" "}
                {response.itemId}
              </h5>
              <h5>
                <span className="attributes">Question :</span>{" "}
                {response.question}
              </h5>
              <h5>
                <span className="attributes">Ta Réponse:</span>
                {response.answer}
              </h5>
              <h5>
                <span className="attributes">Temps :</span> {date}
              </h5>
              {response.response === "Moderation" ? (
                <h6>
                  <h6>
                    <Badge pill variant="primary">
                      Modération
                    </Badge>
                  </h6>
                </h6>
              ) : (
                <h6>
                  {response.response === "Yes" ? (
                    <>
                      {/* <p style={{ color: "green" }}>Approved !!</p> */}
                      <h6>
                        <Badge pill variant="success">
                          Approuvé
                        </Badge>
                      </h6>
                      <Button
                        className="btn-primary"
                        onClick={() => handleShowNumber(response)}
                      >
                        Afficher le numéro
                      </Button>
                    </>
                  ) : (
                    <h6>
                      <Badge pill variant="danger">
                        Opps !!
                      </Badge>
                    </h6>
                  )}
                </h6>
              )}
            </div>
          );
        });
        setResponse(temp);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <>
      <Navbar />
      <Modal show={showNumber} onHide={handleCloseNumber} backdrop="static">
        <Modal.Body>
          <p>Voici le numéro : {PhoneNumber}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseNumber}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleCloseNumber}>
            D'accord
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="response-title">
        <h2>Vos réponses</h2>
        <div className="title-border"></div>
      </div>
      <div className="responses-list">{responses}</div>
    </>
  );
}

export default Response;
