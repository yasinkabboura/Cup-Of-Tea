import React, { useState, useRef } from "react";
import Navbar from "./Navbar";
import "../css/landing.css";
import Axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import image from "../img/lost-2.svg";
import developer from "../img/developer_outline I.svg";
import login from "../img/login-1.svg";
import list_item from "../img/list-item.svg";
import notification from "../img/notification.svg";
import { Container, Row, Button, Form } from "react-bootstrap";
export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const ref = useRef();
  AOS.init();
  AOS.init({
    disable: false,
    startEvent: "DOMContentLoaded",
    initClassName: "aos-init",
    animatedClassName: "aos-animate",
    useClassNames: false,
    disableMutationObserver: false,
    debounceDelay: 50,
    throttleDelay: 99,
    offset: 120,
    delay: 0,
    duration: 700,
    easing: "ease",
    once: false,
    mirror: false,
    anchorPlacement: "top-bottom",
  });

  const sendMessage = () => {
    const data = {
      name,
      email,
      message,
    };
    Axios({
      method: "POST",
      url: "http://localhost:5000/sendmessage",
      data: data,
    })
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setName("");
    setEmail("");
    setMessage("");
  };
  return (
    <>
      <Navbar />
      <div data-aos="fade-right" className="main">
        <div className="intro">
          <div className="part-1">
            <div className="title">
              <h1 id="title-h">Found It</h1>
              <p className="pp"> Perdu-le😕. Listez-le📃. Trouvez-le🤩.</p>
              <Button
                variant="custom"
                size="lg"
                onClick={() => {
                  ref.current.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Commencer
              </Button>
            </div>
          </div>

          <div className="part-2">
            <div className="image">
              <img
                src={image}
                style={{ width: "500px", height: "500px" }}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div data-aos="fade-right">
        <Container fluid className="total-inspiration">
          <div>
            <img className="developer-img" src={developer} alt="" />
          </div>
          <Row className="inspiration">
            <h6 className="section-heading">
              L'inspiration derrière notre projet💡
            </h6>
            <p>
              Avez-vous déjà perdu un de vos objets à l’Enset ? Certainement la
              majorité de nous affirment avoir vécu de telles expériences. Dès
              que vous vous rendez compte que vous avez perdu l’un de vos
              affaires, des questions multiples vous arrivent en tête : quand
              j’ai perdu cet objet ? quels sont les emplacements où j’étais
              avant de le perdre ? Dois-je consulter le service de scolarité en
              premier ou bien me déplacer vers le dernier emplacement où j’étais
              et chercher ? Vous allez au service scolarité mais en vain , vous
              demandez à vos camarades de vous aider ,vous allez chercher par ci
              et par là et malheureusement vous ne trouvez rien, vous commencez
              à paniquer et à perdre patience. D’autre part, vous avez
              certainement déjà trouvé des objets et vous luttez pour trouver
              son propriétaire, et mille questions vous arrivent en tête sur la
              manière de le reconnaître . Cette situation est fatigante n’est ce
              pas ? eh bien nous avons trouvé la solution, cette plateforme va
              résoudre tous ces problèmes et va vous faciliter la vie : dès que
              vous trouvez un objet inscrivez le ici , de même si vous avez
              perdu quelque chose inscrivez là ici , et les autres utilisateurs
              de la plateform vont s’occuper de la tâche de la trouver.
            </p>
          </Row>
        </Container>
      </div>
      <div data-aos="fade-left">
        <Container fluid>
          <div className="total-about">
            <div ref={ref} className="about-heading">
              <h6 className="section-heading">Comment ça fonctionne ⚒️?</h6>
            </div>
            <div className="about-card">
              <div className="info">
                <img
                  src={login}
                  style={{ width: "200px", height: "200px" }}
                  alt=""
                />
                <h4>Créer un compte</h4>
                <p>Au départ, vous devez créer un compte pour commencer.</p>
                <a href="/log-in">
                  <Button variant="custom" size="lg">
                    S'inscrire
                  </Button>
                </a>
              </div>
              <div className="info">
                <img
                  src={list_item}
                  style={{ width: "200px", height: "200px" }}
                  alt=""
                />
                <h4>Liste des objets perdus/trouvés</h4>
                <p>
                  Affichez votre article sur le mur en remplissant certains
                  détails et images. C'est ça !
                </p>
              </div>
              <div className="info">
                <img
                  src={notification}
                  style={{ width: "200px", height: "200px" }}
                  alt=""
                />
                <h4>Recevez une notification</h4>
                <p>
                  Une fois que quelqu'un publie un article, nous en informons
                  nos utilisateurs enregistrés en envoyant une notification.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div data-aos="fade-right">
        <Container fluid>
          <div className="total-contact-form">
            <div className="contact-title">
              <h6 className="section-heading"> Contactez-nous 📨📬</h6>
              <p>
                S'il y a quelque chose que vous voulez suggérer ou peut-être
                juste un bonjour tendre la main.
              </p>
            </div>
            <div className="contact-form">
              <Form>
                <Form.Label>Nom :</Form.Label>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Email :</Form.Label>
                  <Form.Control
                    type="email"
                    size="lg"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Message :</Form.Label>
                  <Form.Control
                    size="lg"
                    as="textarea"
                    rows={6}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                </Form.Group>
                <Button variant="custom" onClick={sendMessage}>
                  envoyer
                </Button>
              </Form>
            </div>
          </div>
        </Container>
      </div>

      <div className="footer">
        <h5 style={{ textAlign: "center" }}>
          Copyright © 2022 ENSET Mohammedia All rights reserved.
        </h5>
      </div>
    </>
  );
}
