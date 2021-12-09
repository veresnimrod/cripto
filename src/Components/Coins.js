import React from "react";
import styles from "./Css/Crypto.module.css";
import { useAuth } from "./Auth.context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

export const Coins = ({ coins }) => {
  const notify = () => toast.warn("Already on List!");
  const notifyy = () => toast.success("Added to Favorites!");
  const { auth } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3005/users/${auth?.user.id}`, {
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [auth?.user.id, auth?.accessToken]);
  if (!coins || !user) {
    return <h2 className={styles.welcome}>Loading...</h2>;
  }
  const myList = user?.favorites;
  async function handleFavorite(e) {
    if (myList.indexOf(e.target.name) === -1) {
      myList.push(e.target.name);
      notifyy();
    } else if (myList.indexOf(e.target.name > -1)) {
      notify();
    }

    await fetch(`http://localhost:3005/users/${auth?.user.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${auth?.accessToken}`,
      },
      body: JSON.stringify({
        favorites: myList,
      }),
    });
  }
  return (
    <>
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        autoClose={1000}
        theme="colored"
      ></ToastContainer>
      {coins.map((coin) => (
        <div key={coin.id} className={styles.container} id={coin.id}>
          <div className={styles.coinrow}>
            <div className={styles.coin}>
              <img
                src={coin.image}
                alt="coinsgecko"
                className={styles.coinimg}
                onClick={() => {
                  window.open(
                    "https://www.coingecko.com/en/coins/" +
                      coin.name.toLowerCase()
                  );
                }}
              ></img>
              <h1 className={styles.coin_h1}>{coin.name}</h1>
              <p className={styles.coin_symbol}>{coin.symbol}</p>
            </div>
          </div>
          <div className={styles.coin_data}>
            <p className={styles.coin_price}>
              {coin.current_price + " " + "€"}
            </p>
            {coin.price_change_percentage_24h < 0 ? (
              <p className={styles.red}>
                {coin.price_change_percentage_24h.toFixed(2) + "%"}
              </p>
            ) : (
              <p className={styles.green}>
                {coin.price_change_percentage_24h.toFixed(2) + "%"}
              </p>
            )}
            <p className={styles.coin_marketcap}>
              {coin.market_cap + " " + "€"}
            </p>
            <div>
              <button
                class={styles.favorite}
                name={coin.id.toLowerCase()}
                onClick={handleFavorite}
                title="Add to Favorites"
              >
                FAV
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
