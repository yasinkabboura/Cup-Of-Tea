import React, { useState } from "react";
import axios from "axios";
import lodash from "lodash";
import "bootstrap/dist/css/bootstrap.css";
import { useToasts } from "react-toast-notifications";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
function LostItem() {
  const [show, setShow] = useState(false);
  const { addToast } = useToasts();
  const token = window.localStorage.getItem("token");
  const [loading, setloading] = useState(false);
  const [itemname, setitemname] = useState("");
  const [description, setdescription] = useState("");
  const [itemquestion, setitemquestion] = useState("");
  const [itemimage, setitemimage] = useState([]);
  const [type, settype] = useState("");
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setloading(true);
    const form = new FormData();
    console.log(itemname);
    if (itemname) {
      const info = new FormData();
      info.append("name", itemname);
      info.append("description", description);
      info.append("question", itemquestion);
      info.append("type", type);
      itemimage.map((itemImage) => {
        info.append("files", itemImage, itemImage);
      });

      axios({
        url: "http://localhost:5000/postitem",
        method: "POST",
        data: info,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (ProgressEvent) => {
          console.log(
            "Upload progress: " +
              Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
              "%"
          );
        },
      })
        .then((response) => {})
        .then(() => {
          addToast("Wahou 🤩 ! Article listé avec succès.", {
            appearance: "success",
          });
          setitemname("");
          setdescription("");
          settype("");
          setitemquestion("");
          setitemimage([]);
          setloading(false);
          setShow(false);
        })
        .catch((err) => {
          setloading(false);
          console.log(err);
          addToast(
            "Oups 😞! Vérifiez la connexion Internet ou réessayez plus tard.",
            {
              appearance: "error",
            }
          );
        });
    } else {
      addToast("Avez-vous manqué l'un des champs obligatoires 🙄 ?", {
        appearance: "error",
      });
    }
  };
  const temporaryShut = () => {
    addToast("La nouvelle liste d'articles a été temporairement désactivée.", {
      appearance: "warning",
    });
    setShow(false);
  };
  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        partager
      </Button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>partager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>
                Nom de l'article<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Saisissez le nom de l'article"
                value={itemname}
                onChange={(e) => setitemname(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Description<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Entrez la description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Entrez une question basée sur l'article</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex:- Quelle est la couleur du téléphone ?"
                value={itemquestion}
                onChange={(e) => setitemquestion(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Type d'article<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="select"
                required={true}
                defaultValue="Choisir..."
                onChange={(e) => settype(e.target.value)}
              >
                <option>Choose..</option>
                <option value={"Lost"}>Perdu</option>
                <option value={"Found"}>Trouvé</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.File
                type="file"
                id="formimage"
                label="Télécharger une image"
                onChange={(e) => {
                  let { files } = e.target;
                  lodash.forEach(files, (file) => {
                    setitemimage((item) => [...item, file]);
                  });
                }}
                multiple
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            fermé
          </Button>
          <Button variant="primary" onClick={handleClose}>
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
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LostItem;
