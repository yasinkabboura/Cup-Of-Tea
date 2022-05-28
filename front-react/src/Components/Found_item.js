import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Modal, Form } from "react-bootstrap";

function Found_item() {
    const [itemname, setitemname] = useState("");
    const [description, setdescription] = useState("");
    const [itemimage, setitemimage] = useState("");

    const [showF, setShowF] = useState(false);
    const token = window.localStorage.getItem("token");

    const handleCloseF = () => {
        const payload = {
            name: itemname,
            description: description,
            itemPictures: itemimage,
        };
        axios({
            url: "http://localhost:5000/founditem",
            method: "POST",
            data: payload,
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
            withCredentials: true,
            credentials: "include",
        })
            .then((response) => {})
            .catch((err) => console.log(err));

        setShowF(false);
    };
    const handleShowF = () => setShowF(true);

    return (
        <>
            <Button variant="primary" onClick={handleShowF}>
                Objet trouvé
            </Button>

            <Modal
                show={showF}
                onHide={handleCloseF}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Objet trouvé</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Nom d'objet</Form.Label>
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
                            <Form.File
                                type="file"
                                id="formimage"
                                label="choisir images"
                                onChange={(e) => setitemimage(e.target.files[0])}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowF(false)}>
                        fermer
                    </Button>
                    <Button variant="primary" onClick={handleCloseF}>
                        Soumettre
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Found_item;
