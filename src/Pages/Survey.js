import React from "react";
import styles from "../Components/Css/Survey.module.css";
import { useState } from "react";
import { useAuth } from "../Components/Auth.context";
import { useHistory } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Components/Navbar";

export const Survey = () => {
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const history = useHistory();

  const notify = () => toast.success("Opinion Added!");

  let to = "/";

  const [values, setValues] = useState({
    id: auth?.user.id,
    name: auth?.user.lastname,
    email: data?.email,
    favorite: data?.favorite,
    worst: data?.worst,
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  }

  async function sendSurvey(e) {
    await fetch(`http://localhost:3005/comments`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${auth?.accessToken}`,
      },
      body: JSON.stringify({
        userid: values.id,
        name: values.name,
        favorite: values.favorite,
        worst: values.worst,
      }),
    });
    notify();
    setTimeout(() => {
      history.push(to);
    }, 1500);
  }

  let isValid = true;
  if (!values?.favorite || !values?.worst) {
    isValid = false;
  }
  console.log(isValid);
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.name}>
          <label for="name">Name</label>
          <input
            type="text"
            name="name"
            value={auth.user.lastname}
            onChange={handleChange}
          ></input>
        </div>
        <div className={styles.best}>
          <p>Which coin is the best investment today ?</p>
          <input
            type="text"
            name="favorite"
            value={values?.favorite}
            onChange={handleChange}
          ></input>
        </div>
        <div className={styles.worst}>
          <p>Which coin is the worst investment today ?</p>
          <input
            type="text"
            name="worst"
            value={values?.worst}
            onChange={handleChange}
          ></input>
        </div>

        <div className={styles.button}>
          {isValid && (
            <button className={styles.button} onClick={sendSurvey}>
              Send
            </button>
          )}
        </div>
        <ToastContainer
          position="top-center"
          hideProgressBar={true}
          autoClose={700}
          theme="colored"
        ></ToastContainer>
      </div>
    </>
  );
};
