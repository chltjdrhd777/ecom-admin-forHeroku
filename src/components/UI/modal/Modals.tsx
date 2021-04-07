import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";

interface PropType {
  show: boolean;
  handleChanges?: () => void;
  handleClose?: () => void;
  modalBody?: any;
  title?: string;
  closeMeessage?: string;
  saveMessage?: string;
  size?: "sm" | "lg" | "xl";
  buttons?: { label: string; color: string; onClick: () => void }[];
  css?: boolean;
}

function Modals({ show, handleChanges, handleClose, modalBody, title, closeMeessage, saveMessage, size, buttons, css }: PropType) {
  return (
    <Modal show={show} onHide={handleClose} animation={true} size={size}>
      <ModalCss css={css}>
        <Modal.Header closeButton className="Modal_header">
          <Modal.Title className="Modal_title">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody()}</Modal.Body>
        <Modal.Footer>
          {buttons ? (
            buttons.map((eachButtonInfo, index) => (
              <Button variant={eachButtonInfo.color} onClick={eachButtonInfo.onClick} key={index} className="custom_button_color_darkblue">
                {eachButtonInfo.label}
              </Button>
            ))
          ) : (
            <>
              <Button variant="secondary" onClick={handleClose}>
                {closeMeessage ? closeMeessage : "Close"}
              </Button>
              <Button variant="primary" onClick={handleChanges}>
                {saveMessage ? saveMessage : "Save Changes"}
              </Button>
            </>
          )}
        </Modal.Footer>
      </ModalCss>
    </Modal>
  );
}

const ModalCss = styled.section<{ css?: boolean }>`
  .Modal_header {
    background-color: ${(props) => props.css && "black"};
    & .Modal_title {
      color: ${(props) => props.css && "white"};
    }

    & .close {
      ${(props) =>
        props.css && { background: "white", opacity: "1", borderRadius: "10px", padding: "0px 5px", marginTop: "-6px", marginRight: "1px" }}
    }
  }

  .modal-footer {
    & .custom_button_color_darkblue {
      background-color: ${(props) => props.css && "#425971"};
    }
  }
`;

export default Modals;
