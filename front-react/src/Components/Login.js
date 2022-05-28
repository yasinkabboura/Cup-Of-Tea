import React, { useState } from "react";
import "../css/newSignup.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { Spinner } from "react-bootstrap";
function Login() {
  const [loading, setloading] = useState(false);
  let [info, setinfo] = useState("");
  const [user_info, setuser_info] = useState("");
  const history = useHistory();
  function login() {
    setloading(true);
    var payload = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
    axios({
      url: "http://localhost:5000/login",
      method: "POST",
      data: payload,
    })
      .then((response) => {
        if (response.data.user) {
          setuser_info(response.data.user);
          localStorage.setItem("token", response.data.jwt_token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          history.push({ pathname: "/annonces", user: response.data.user });
        } else {
          setinfo(response.data);
        }
      })
      .catch((error) => {
        setloading(false);
        console.log(error);
        console.log("Error occured");
      });
  }
  return (
    <>
      <Navbar />
      <div style={{ display: "flex" }}>
        <form className="Box-1 login">
          <h1>Connexion</h1>
          <p style={{ color: "white" }}>{info}</p>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email "
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            id="password"
            name="password"
            required
          />
          <button type="button" className="submit" onClick={login}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="sr-only">Chargement...</span>
              </>
            ) : (
              <>Soumettre</>
            )}
          </button>
          <p style={{ color: "white" }}>
            vous n'avez pas de compte?{" "}
            <a style={{ color: "black" }} href="/sign-up">
              Cliquez ici
            </a>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
