import React from "react";
import styles from "./Css/Modal.module.css";

export function Modal({ closeModal, confirm, message }) {
  return (
    <>
      <div className={styles.modal_container}>
        <div className={styles.modal}>
          <h1>{message}</h1>
          <div className={styles.button}>
            <button onClick={() => confirm()}>Confirm</button>
            <button onClick={() => closeModal(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}
