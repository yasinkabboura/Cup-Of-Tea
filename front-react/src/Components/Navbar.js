import React from "react";
import { setConstraint } from "../constraints";
import "../css/Navbar.css";
import image from "../img/ShieldSearch.png";
import axios from "axios";
import LostItem from "./Lost_item";
import { ToastProvider } from "react-toast-notifications";
function Navbar() {
  const token = window.localStorage.getItem("token");
  const signout = () => {
    setConstraint(false);

    console.log("Signed out !");
    axios({
      url: "http://localhost:5000/signout",
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(localStorage.clear())
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="navbar">
        <div className="logo">
          <a style={{ textDecoration: "none", color: "white" }} href="/">
            <img
              src={image}
              style={{ width: "50px", height: "50px", padding: "0px" }}
              alt=""
            />
          </a>
        </div>

        <div
          style={token ? { display: "none" } : {}}
          id="login"
          className="signin"
        >
          <ul>
            <a
              id="a"
              style={{ textDecoration: "none", color: "white" }}
              href="/sign-up"
            >
              Inscrivez-vous
            </a>
          </ul>
          <ul>
            <a
              id="a"
              style={{ textDecoration: "none", color: "white" }}
              href="/log-in"
            >
              Connexion
            </a>
          </ul>
        </div>
        <div style={token ? {} : { display: "none" }} className="postsignin">
          <ToastProvider autoDismiss={true} placement={"bottom-right"}>
            <div>
              <LostItem />
            </div>
          </ToastProvider>
          <ul>
            <a
              style={{ textDecoration: "none", color: "white" }}
              href="/annonces"
            >
              annonces
            </a>
            <a
              style={{ textDecoration: "none", color: "white" }}
              href="/reponses"
            >
              Réponses
            </a>
            <a
              style={{ textDecoration: "none", color: "white" }}
              href="/mesannonces"
            >
              Mes annonces
            </a>
            <a
              style={{ textDecoration: "none", color: "white" }}
              onClick={signout}
              href="/log-in"
            >
              Déconnexion
            </a>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
