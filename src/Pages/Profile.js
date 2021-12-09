import React, { useEffect, useState } from "react";
import { useAuth } from "../Components/Auth.context";
import styles from "../Components/Css/Profile.module.css";
import { useHistory } from "react-router";
import { Modal } from "../Components/Modal";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../Components/Navbar";

export function Profile() {
  const { auth, logout } = useAuth();
  const [user, setUser] = useState(null);
  const history = useHistory("");
  const notifyy = () => toast.success("Profile Updated!");
  const notify = () => toast.warn("Your account has been Deleted!")
  let to = '/'
  
  if (!auth?.user) {
    history.push("/");
  }

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3005/users/${auth?.user.id}`, {
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [auth?.user.id, auth?.accessToken, logout]);

  const [values, setValues] = useState({
    firstname: user?.firstname,
    lastname: user?.lastname,
    username: user?.username,
    email: user?.email,
    password: user?.password,
  });

  function handleChange(e) {
    const newValues = { ...values };
    newValues[e.target.name] = e.target.value;
    setValues(newValues);
  }
  let isValid = false;
  if (
    values.firstname ||
    values.lastname ||
    values.username ||
    values.email ||
    values.password !== undefined
  ) {
    isValid = true;
  }

  async function handleUpdateProfile() {
    await fetch(`http://localhost:3005/users/${auth?.user.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${auth?.accessToken}`,
      },
      body: JSON.stringify({
        firstname: values.firstname,
        lastname: values.lastname,
        username: values.username,
        email: values.email,
        password: values.password,
      }),
    });
    notifyy();
  }
  async function handleDelete() {
    await fetch(`http://localhost:3005/users/${auth?.user.id} `, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`,
      },
    });
    notify()
    setTimeout(() => {
      logout();
      history.push(to);
    }, 1500);
  }
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.photocontainer}>
          <img className={styles.image} src={user?.url} />
        </div>
        <div className={styles.infocontainer}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="firstname"
              value={values?.firstname}
              placeholder={user?.firstname}
              onChange={handleChange}
            ></input>
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="lastname"
              value={values?.lastname}
              placeholder={user?.lastname}
              onChange={handleChange}
            ></input>
          </div>
          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={values?.username}
              placeholder={user?.username}
              onChange={handleChange}
            ></input>
          </div>
          <div>
            <label>Email Adress</label>
            <input
              type="email"
              name="email"
              value={values?.email}
              placeholder={user?.email}
              onChange={handleChange}
            ></input>
          </div>
          <div>
            <label>Change Password</label>
            <input
              type="password"
              name="password"
              value={values?.password}
              placeholder="Enter New Password"
              onChange={handleChange}
            ></input>
          </div>
          <div className={styles.buttonholder}>
            {isValid && (
              <button className={styles.button} onClick={handleUpdateProfile}>
                Update Profile
              </button>
            )}
            <button
              className={styles.button}
              onClick={() => setOpenModal(true)}
            >
              Delete Profile
            </button>
          </div>
          {openModal && (
            <Modal
              closeModal={setOpenModal}
              confirm={handleDelete}
              message={"Are you sure ?"}
            />
          )}
        </div>
        <ToastContainer
          position="top-center"
          hideProgressBar={true}
          autoClose={1000}
          theme="colored"
        ></ToastContainer>
      </div>
    </>
  );
}
