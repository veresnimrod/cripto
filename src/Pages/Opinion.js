import React from "react";
import Navbar from "../Components/Navbar";
import { useState } from "react/cjs/react.development";
import { useAuth } from "../Components/Auth.context";
import { useEffect } from "react";
import styles from "../Components/Css/Opinion.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Opinion() {
  const [data, setData] = useState();
  const { auth } = useAuth();
  const notify = () => toast.warn("Post Deleted!");

  useEffect(() => {
    fetch(`http://localhost:3005/comments/`, {
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [auth?.user.id, auth?.accessToken]);

  async function handleDelete(e) {
    const id = e.target.name;
    console.log(id);

    await fetch(`http://localhost:3005/comments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`,
      },
    });
    notify();
  }
  if (auth?.user) {
    return (
      <div>
        <Navbar />
        <div className={styles.title}>
          <h1>What our users say</h1>
        </div>
        <div className={styles.background}>
          {data?.map((comment) => (
            <div key={comment.id} className={styles.container}>
              <div className={styles.comment}>{comment.name}</div>

              <div className={styles.favorite}>{comment.favorite}</div>
              <div className={styles.worst}>{comment.worst}</div>
              <div>
                {auth?.user.id === comment.userid && (
                  <button
                    name={comment.id}
                    onClick={handleDelete}
                    className={styles.delbutton}
                  >
                    X
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <ToastContainer
          position="top-center"
          autoClose="700"
          theme="colored"
          hideProgressBar="true"
        />
      </div>
    );
  } else {
    return (
      <div className={styles.welcome}>
        <h5>
          Welcome.Please <a href="/login">Login!</a>
        </h5>
        <h6>
          Don't have an account yet? <a href="/register">Sign Up</a>
        </h6>
      </div>
    );
  }
}
