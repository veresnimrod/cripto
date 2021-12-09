import styles from "../Components/Css/Auth.module.css";
import { useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../Components/Auth.context";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Navbar from "../Components/Navbar";

export function Auth() {
  const notifyy = () => toast.success("Upload Completed!");
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    "retype-password": "",
  });
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    "retype-password": "",
    profilePicture: "",
  });
  const [apiError, setApiError] = useState("");
  const history = useHistory();
  const location = useLocation();
  const { auth, login } = useAuth();
  const [ImageSelected, setImageSelected] = useState("");
  const [CloudResponse, setCloudResponse] = useState("");

  if (auth) {
    history.push("/");
    return null;
  }
  let isLogin = false;
  if (location.pathname.includes("login")) {
    isLogin = true;
  }
  function handleChange(e) {
    const newValues = { ...values };
    newValues[e.target.name] = e.target.value;
    const newErrors = { ...errors };
    newErrors[e.target.name] = "";

    setValues(newValues);
    setErrors(newErrors);
    setApiError("");
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }
    const data = await fetch(
      `http://localhost:3005/${isLogin ? "login" : "register"}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          firstname: values.firstname,
          lastname: values.lastname,
          username: values.username,
          email: values.email,
          password: values.password,
          url: CloudResponse,
          favorites: [],
        }),
      }
    ).then((res) => res.json());

    if (data?.accessToken) {
      login(data);
      let to = "/";

      if (location.state?.from) {
        to = location.state?.from.pathname + location.state.from.search;
      }
      history.push(to);
      return null;
    } else {
      setApiError(data);
    }
  }
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", ImageSelected);
    formData.append("upload_preset", "hk1uyj5h");
    const data = await axios.post(
      "https://api.cloudinary.com/v1_1/dfrvtlslz/image/upload",
      formData
    );
    if (data) {
      setCloudResponse(data.data.url);
      notifyy();
    } else setCloudResponse("");
    return CloudResponse;
  };
  function isFormValid() {
    let isValid = true;
    let newErrors = { ...errors };

    if (!isLogin) {
      if (!CloudResponse) {
        isValid = false;
        newErrors.profilePicture = "Please update a profile picture!";
      }

      if (!values.firstname) {
        isValid = false;
        newErrors.firstname = "Please enter your First Name!";
      }

      if (!values.lastname) {
        isValid = false;
        newErrors.lastname = "Please enter your Last Name!";
      }
      if (!values.username) {
        isValid = false;
        newErrors.username = "Please enter your Username!";
      }

      if (!values.email) {
        isValid = false;
        newErrors.email = "Please enter your Email!";
      }

      if (!values.password) {
        isValid = false;
        newErrors.password = "Please choose a Password!";
      }

      if (values.password !== values["retype-password"]) {
        isValid = false;
        newErrors["retype-password"] = "Passwords did not match!";
      }
    } else {
      if (!values.email) {
        isValid = false;
        newErrors.email = "Please enter your email!";
      }
      if (!values.password) {
        isValid = false;
        newErrors.password = "Please enter a password!";
      }
    }
    setErrors(newErrors);
    return isValid;
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div>
          <h1>{isLogin ? "Login" : "Register"}</h1>
        </div>
        <form onSubmit={handleSubmit} noValidate={true} className={styles.form}>
          {!isLogin && (
            <div className={styles.inputcontainer}>
              {isFormValid && (
                <input
                  type="text"
                  placeholder="First Name"
                  id="firstname"
                  name="firstname"
                  value={values.firstname}
                  onChange={handleChange}
                  autoComplete="off"
                ></input>
              )}
              <div className={styles.error}>{errors.firstname}</div>
            </div>
          )}
          {!isLogin && (
            <div className={styles.inputcontainer}>
              <label></label>
              <input
                type="text"
                placeholder="Last Name"
                id="lastname"
                name="lastname"
                value={values.lastname}
                onChange={handleChange}
                autoComplete="off"
              ></input>
              <div className={styles.error}>{errors.lastname}</div>
            </div>
          )}
          {!isLogin && (
            <div className={styles.inputcontainer}>
              <label></label>
              <input
                type="text"
                placeholder="Username"
                id="username"
                name="username"
                value={values.username}
                onChange={handleChange}
                autoComplete="off"
              ></input>
              <div className={styles.error}>{errors.username}</div>
            </div>
          )}
          <div className={styles.inputcontainer} id={styles.email}>
            <label></label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              autoComplete="off"
            ></input>
            <div className={styles.error}>{errors.email}</div>
          </div>
          <div className={styles.inputcontainer}>
            <label></label>
            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              autoComplete="off"
            ></input>
            <div className={styles.error}>{errors.password}</div>
          </div>
          {!isLogin && (
            <div className={styles.inputcontainer}>
              <label></label>
              <input
                className={styles.input}
                type="password"
                placeholder="Retype Password"
                id="retype-password"
                name="retype-password"
                value={values["retype-password"]}
                onChange={handleChange}
                autoComplete="off"
              ></input>
              <div className={styles.error}>{errors["retype-password"]}</div>
            </div>
          )}
          {!isLogin && (
            <div className={styles.photo}>
              <div>
                <h2>Select your Profile Picture</h2>
                <input
                  type="file"
                  placeholder="Upload an image"
                  onChange={(e) => {
                    setImageSelected(e.target.files[0]);
                  }}
                ></input>
                <button
                  className={styles.signup}
                  onClick={(e) => {
                    e.preventDefault();
                    uploadImage();
                  }}
                >
                  Upload
                </button>
                <div className={styles.error}>{errors.profilePicture}</div>
              </div>
            </div>
          )}
          <button type="submit" className={styles.signup}>
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className={styles.apiError}>{apiError}</div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose="700"
        theme="colored"
        hideProgressBar="true"
      />
    </>
  );
}
