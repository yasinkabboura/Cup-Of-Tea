import React, { useState, useEffect } from "react";
import "../css/itempage.css";
import sant from "../img/Santorini.jpg";
import lodash from "lodash";
import { useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import { LOGGED_IN, setConstraint } from "../constraints";
import { useToasts } from "react-toast-notifications";
import Axios from "axios";
import {
  Button,
  Modal,
  Form,
  Container,
  Card,
  ListGroup,
  ListGroupItem,
  Col,
} from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
function ItemPage(props) {
  const { addToast } = useToasts();
  const [Itemname, setItemname] = useState("");
  const [ActivationRequest, setActivationRequest] = useState(false);
  const [Createdby, setCreatedby] = useState("");
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [index, setIndex] = useState(0);
  const [authenticationPage, setauthenication] = useState("");
  const [validateUser, setvalidateUser] = useState(false);
  const [Question, setQuestion] = useState(false);
  const [alreadyAnswered, setalreadyAnswered] = useState(false);
  const [showQuestion, setshowQuestion] = useState(false);
  const [answer, setAnswer] = useState("");
  const [itemid, setitemid] = useState("");
  const [itemname, setitemname] = useState("");
  const [description, setdescription] = useState("");
  const [itemquestion, setitemquestion] = useState("");
  const [itemimage, setitemimage] = useState([]);
  const [newitemimage, setnewitemimage] = useState([]);
  const [type, settype] = useState("");
  const [messageId, setmessageId] = useState("");
  const [response, setResponse] = useState("");
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseprompt = () => setvalidateUser(false);
  const handleShowprompt = (id, answer) => {
    setmessageId(id);
    setResponse(answer);
    setvalidateUser(true);
  };
  const handleCloseActivation = () => {
    setActivationRequest(false);
  };
  const submitActivate = () => {
    Axios({
      method: "POST",
      url: `http://localhost:5000/activateItem/${item_id}`,
    })
      .then((res) => {
        addToast("Article activé 👍", {
          appearance: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
    setActivationRequest(false);
  };
  const handleCloseQuestion = () => setQuestion(false);
  const handleShowQuestion = () => setQuestion(true);
  const handleShow = () => setShow(true);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  const history = useHistory();
  setConstraint(true);
  const item_type = props.location.search
    .substring(1)
    .split("=")[2]
    .split("/")[0];
  const item_id = props.location.search
    .substring(1)
    .split("=")[1]
    .split("&")[0];
  const current_user = props.location.search.substring(1).split("/")[1];
  const temp = [];
  const validation = [];
  useEffect(() => {
    const { location } = props;
    Axios({
      url: `http://localhost:5000/item/${item_id}`,
      method: "GET",
    })
      .then((response) => {
        const data = response.data.Item[0];
        const answers = response.data.Answers;
        console.log(data);
        answers.forEach((ans) => {
          if (JSON.parse(localStorage.getItem("user"))._id === ans.givenBy) {
            console.log("Present");
            setalreadyAnswered(true);
            console.log(alreadyAnswered);
          }
        });
        setitemid(data._id);
        setitemname(data.name);
        setdescription(data.description);
        setitemquestion(data.question);
        settype(data.type);
        setCreatedby(data.createdBy);
        setitemimage([]);
        data.itemPictures.map((img) => {
          setitemimage((itemImg) => [...itemImg, img]);
        });
        console.log(itemimage);
        let created_date = new Date(data.createdAt);
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
        console.log(data);
        temp.push(
          <div className="itemDescription">
            <h3 className="attributes" style={{ maxWidth: "300px" }}>
              Nom de l'article : <span className="details">{data.name}</span>{" "}
            </h3>
            <hr></hr>
            <h3 className="attributes" style={{ maxWidth: "300px" }}>
              Description de l'article :{" "}
              <span className="details">{data.description}</span>{" "}
            </h3>
            <hr></hr>
            <h3 className="attributes">
              Type d'élément : <span className="details">{data.type}</span>{" "}
            </h3>
            <hr></hr>
            <h3 className="attributes">
              Statut :
              {data.status ? (
                <>
                  <span className="details"> Actif</span>
                </>
              ) : (
                <>
                  <span className="details">Inactif</span>
                </>
              )}{" "}
            </h3>
            <hr></hr>
            <h6 className="attributes">
              Créé à : <span className="details">{createdAt}</span>{" "}
            </h6>
            {current_user === "true" ? (
              <div className="ed-button">
                <Button variant="danger" onClick={handleShowDelete}>
                  Effacer l'article
                </Button>
                <Button variant="primary" onClick={handleShow}>
                  Modifier l'article
                </Button>
                {data.status ? (
                  <></>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => setActivationRequest(true)}
                    >
                      Réactiver l'article
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div>
                {alreadyAnswered ? (
                  <div className="ed-button">
                    <Button
                      variant="secondary"
                      disabled
                      onClick={handleShowQuestion}
                    >
                      {data.type === "Lost" ? "Found Item" : "Claim Item"}
                    </Button>
                  </div>
                ) : (
                  <div className="ed-button">
                    <Button variant="primary" onClick={handleShowQuestion}>
                      {data.type === "Lost" ? "Found Item" : "Claim Item"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
        setItemname(temp);
        console.log(answers);
        answers.map((e) => {
          let created_date = new Date(e.createdAt);
          e.createdAt =
            created_date.getDate() +
            "/" +
            created_date.getMonth() +
            "/" +
            created_date.getFullYear() +
            " " +
            created_date.getHours() +
            ":" +
            created_date.getMinutes();
        });
        validation.push(
          <div>
            {current_user === "true" ? (
              <div>
                <div>
                  <h2 className="attributes">Ta question :</h2>
                  <h3>{data.question}</h3>
                </div>

                <div>
                  <h2 className="attributes">Réponses soumises :</h2>
                  {answers.length === 0 ? (
                    <h3>Pas encore de réponses.</h3>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {answers.map((answer) => (
                        <>
                          <div className="responses">
                            <Card
                              border="primary"
                              style={{ maxWidth: "500px" }}
                            >
                              <Card.Body>
                                <Card.Title style={{ maxWidth: "500px" }}>
                                  Répondre : {answer.answer}
                                </Card.Title>
                              </Card.Body>
                              <ListGroup className="list-group-flush">
                                <ListGroupItem>
                                  Date : {answer.createdAt}
                                </ListGroupItem>
                                <ListGroupItem>Valider :</ListGroupItem>
                              </ListGroup>
                              <Card.Body>
                                {answer.response === "Moderation" ? (
                                  <div className="ed-button">
                                    <Button
                                      variant="danger"
                                      onClick={() =>
                                        handleShowprompt(answer._id, "No")
                                      }
                                    >
                                      No
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={() =>
                                        handleShowprompt(answer._id, "Yes")
                                      }
                                    >
                                      Yes
                                    </Button>
                                  </div>
                                ) : (
                                  <p>
                                    Déjà soumis en tant que : "{answer.response}
                                    "
                                  </p>
                                )}
                              </Card.Body>
                            </Card>
                          </div>
                        </>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        );
        setauthenication(validation);
      })
      .catch((err) => {
        console.log("Error :", err);
      });
  }, [alreadyAnswered]);
  const submitResponse = () => {
    Axios({
      url: `http://localhost:5000/confirmResponse/${messageId}`,
      method: "POST",
      data: { response: response },
    })
      .then((res) => {
        console.log(res);
        addToast("Réponse enregistrée 👍", {
          appearance: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
    handleCloseprompt(true);
  };
  const delete_item = () => {
    Axios({
      url: "http://localhost:5000/deleteitem",
      method: "POST",
      data: { item_id },
    })
      .then((response) => {
        console.log(response);
        handleCloseDelete();
        addToast("L'article a été envoyé à 🗑️ avec succès!", {
          appearance: "success",
        });
        setTimeout(() => {
          history.push("/annonces");
        }, 2000);
      })
      .catch((err) => {
        console.log("Error");
      });
  };
  const handleEdit = () => {
    const info = new FormData();
    info.append("name", itemname);
    info.append("description", description);
    info.append("question", itemquestion);
    info.append("type", type);
    info.append("id", item_id);
    info.append("createdBy", Createdby);
    if (newitemimage.length > 0) {
      newitemimage.map((itemImage) => {
        info.append("itemPictures", itemImage, itemImage.name);
      });
    } else {
      itemimage.map((image) => {
        console.log(image);
        info.append("olditemPictures", image.img);
      });
    }
    Axios({
      url: "http://localhost:5000/edititem",
      method: "POST",
      data: info,
    })
      .then((res) => {
        console.log(res);
        addToast("Article modifié✏️ avec succès!", {
          appearance: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
    setShow(false);
  };
  const show_question = () => {
    setshowQuestion(true);
  };
  const submitAnswer = () => {
    Axios({
      url: "http://localhost:5000/submitAnswer",
      method: "POST",
      data: {
        itemId: item_id,
        question: itemquestion,
        answer: answer,
        givenBy: JSON.parse(localStorage.getItem("user")),
        belongsTo: Createdby,
      },
    })
      .then((res) => {
        console.log(res);
        handleCloseQuestion();
        addToast("Réponse enregistrée ✔️", {
          appearance: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
    setAnswer("");
  };
  return (
    <>
      <Navbar />
      <Container fluid>
        <div className="itempage">
          <Carousel autoPlay className="carousel" infiniteLoop width="50%">
            {itemimage.map((i) => {
              return (
                <div style={{ border: "2px solid black" }}>
                  <img
                    src={`https://ensetinnova.s3.amazonaws.com/${i.img}`}
                    alt="item"
                  />
                </div>
              );
            })}
          </Carousel>
          <div>{Itemname}</div>
        </div>
        <div>{authenticationPage}</div>
      </Container>

      <Modal
        show={ActivationRequest}
        onHide={handleCloseActivation}
        backdrop="static"
      >
        <Modal.Body>
          <p>Es-tu sûr ? </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseActivation}>
            Non
          </Button>
          <Button variant="danger" onClick={submitActivate}>
            Oui
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDelete} onHide={handleCloseDelete} backdrop="static">
        <Modal.Body>
          <p>Es-tu sûr ? </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseDelete}>
            Non
          </Button>
          <Button variant="danger" onClick={delete_item}>
            Oui
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={validateUser} onHide={handleCloseprompt} backdrop="static">
        <Modal.Body>
          <p>Une fois soumis, vous ne pouvez pas annuler. Es-tu sûr ? </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={() => handleCloseprompt(true)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={submitResponse}>
            Soumettre
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={Question} onHide={handleCloseQuestion} backdrop="static">
        {showQuestion ? (
          <div>
            <Modal.Body>
              <Form.Group>
                <Form.Label>{itemquestion}</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Entrez la réponse"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCloseQuestion}>
                Annuler
              </Button>
              <Button variant="primary" onClick={submitAnswer}>
                Soumettre
              </Button>
            </Modal.Footer>
          </div>
        ) : (
          <div>
            <Modal.Body>
              <p>Êtes-vous sûr d'avoir trouvé l'article ?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCloseQuestion}>
                Nom
              </Button>
              <Button variant="danger" onClick={show_question}>
                Oui
              </Button>
            </Modal.Footer>
          </div>
        )}
      </Modal>
      <div>
        <Modal
          show={show}
          onHide={() => setShow(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Article perdu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Article nom</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Entrer nom"
                  value={itemname}
                  onChange={(e) => setitemname(e.target.value)}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Entrer Description"
                  value={description}
                  onChange={(e) => setdescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Entrez une question basée sur l'élément</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex:- Quelle est la couleur du téléphone ?"
                  value={itemquestion}
                  onChange={(e) => setitemquestion(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label> type de l'article</Form.Label>
                <Form.Control
                  as="select"
                  required={true}
                  defaultValue="Choisir..."
                  value={type}
                  onChange={(e) => settype(e.target.value)}
                >
                  <option>Choisir..</option>
                  <option value={"Lost"}>Perdu</option>
                  <option value={"Found"}>Trouvé</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.File
                  type="file"
                  id="formimage"
                  label="Entrée d'images"
                  onChange={(e) => {
                    // console.log(e.target.files)
                    let { files } = e.target;
                    lodash.forEach(files, (file) => {
                      // console.log(file)
                      setnewitemimage((item) => [...item, file]);
                    });
                  }}
                  multiple
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleEdit}>
              Soumettre
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
export default ItemPage;
