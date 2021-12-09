import React, { useEffect } from "react";
import { useState } from "react/cjs/react.development";
import { useAuth } from "../Components/Auth.context";
import styles from "../Components/Css/Home.module.css";
import axios from "axios";
import StarfieldAnimation from "react-starfield-animation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPlayer from "react-player";
import Navbar from "../Components/Navbar";

export const Home = () =>{
  const notify = () => toast.warn("Deleted from Favorites!");
  const { auth } = useAuth();
  const [CoinList, setCoinList] = useState(null);
  const [user, setUser] = useState(null);
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=120&page=1&sparkline=false";

  useEffect(() => {
    fetch(`http://localhost:3005/users/${auth?.user.id}`, {
      headers: {
        Authorization: `Bearer ${auth?.accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [auth?.user.id, auth?.accessToken]);

  useEffect(() => {
    axios.get(url).then((response) => {
      setCoinList(response.data);
    });
  }, []);

  if (!CoinList) {
    return <h2 className={styles.welcome}>Loading..</h2>;
  }
  const myCoins = CoinList?.sort(
    (firstCoin, secondCoin) =>
      firstCoin.price_change_percentage_24h -
      secondCoin.price_change_percentage_24h
  );
  const Loser = myCoins?.[0];
  const Winner = myCoins?.[119];

  const myFavorites = user?.favorites;
  let FavoriteList = [];
  function getFavorites() {
    for (let i = 0; i < CoinList?.length; i++) {
      for (let j = 0; j < myFavorites?.length; j++)
        if (CoinList[i].id == myFavorites[j]) {
          FavoriteList.push(CoinList[i]);
        }
    }
  }
  getFavorites();

  async function deleteFavorite(e) {
    const dCoin = e.target.name;
    console.log(e.target.name);
    const newFavorites = FavoriteList.filter(
      (e) => e.id.toLowerCase() !== dCoin
    );
    const newList = [];
    for (let i = 0; i < newFavorites.length; i++) {
      newList.push(newFavorites[i].id);
    }
    await fetch(`http://localhost:3005/users/${auth?.user.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${auth?.accessToken}`,
      },
      body: JSON.stringify({
        favorites: newList,
      }),
    });
    window.location.reload();
  }
  if (auth?.user) {
    return (
      <>
        <Navbar />
        <div className={styles.welcome}>Welcome {auth?.user.username}</div>
        <div className={styles.infocontainer}>
          <div className={styles.favorite}>
            <h2>Favorites</h2>
            {FavoriteList.map((coin) => (
              <div key={coin.id} className={styles.container} id={coin.id}>
                <div className={styles.coinrow}>
                  <div className={styles.icon}>
                    <img
                      className={styles.iconicon}
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
                  </div>
                  <div className={styles.coinname}>
                    <h1>{coin.name}</h1>
                  </div>
                  <div className={styles.coinprice}>
                    {coin.price_change_percentage_24h < 0 ? (
                      <h1 className={styles.red}>
                        {coin.price_change_percentage_24h.toFixed(2) + "%"}
                      </h1>
                    ) : (
                      <h1 className={styles.green}>
                        {coin.price_change_percentage_24h.toFixed(2) + "%"}
                      </h1>
                    )}
                  </div>
                  <div className={styles.coincurrentprice}>
                    <h1>{coin.current_price.toFixed(3) + "€"}</h1>
                  </div>
                  <div className={styles.deleteicon}>
                    <button
                      className={styles.delbutton}
                      className={styles.button}
                      name={coin.id}
                      onClick={deleteFavorite}
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.dailyinfo}>
            <div className={styles.winner}>
              <div className={styles.dailytitle}>
                <h2>Winner of The Day</h2>
              </div>
              <div className={styles.dailyimg}>
                <img src={Winner.image}></img>
              </div>
              <div className={styles.dailyname}>
                <h1>{Winner.name}</h1>
              </div>
              <div className={styles.dailyprice}>
                <h1>Price {Winner.current_price.toFixed(3) + "€"}</h1>
              </div>
              <div className={styles.dailypercent}>
                <h1 className={styles.green}>
                  {Winner.price_change_percentage_24h.toFixed(2) + "%"}
                </h1>
              </div>
            </div>
            <div className={styles.loser}>
              <div className={styles.dailytitle}>
                <h2>Loser of The Day</h2>{" "}
              </div>
              <div className={styles.dailyimg}>
                <img src={Loser.image}></img>
              </div>
              <div className={styles.dailyname}>
                <h1>{Loser.name}</h1>
              </div>
              <div className={styles.dailyprice}>
                <h1>Price {Loser.current_price.toFixed(3) + "€"}</h1>
              </div>
              <div className={styles.dailypercent}>
                <h1 className={styles.red}>
                  {Loser.price_change_percentage_24h.toFixed(2) + "%"}
                </h1>
              </div>
            </div>
            <div className={styles.myopinion}>
              {" "}
              <a href="/opinion" className={styles.opinion}>
                My Opinion
              </a>
            </div>
            <ToastContainer
              position="top-center"
              hideProgressBar={true}
              autoClose={1000}
              theme="colored"
            ></ToastContainer>
          </div>
        </div>
        <div className={styles.player}>
          <div className={styles.videobox}>
            <ReactPlayer
              controls
              width="360px"
              height="240px"
              url="https://www.youtube.com/watch?v=_Z55lRcBOKo"
            />
          </div>
          <div className={styles.videobox}>
            {" "}
            <ReactPlayer
              controls
              width="360px"
              height="240px"
              url="https://www.youtube.com/watch?v=aplvLKLdiMQ"
            />
          </div>
          <div className={styles.videobox}>
            <ReactPlayer
              controls
              width="360px"
              height="240px"
              url="https://www.youtube.com/watch?v=u-vrdPtZVXc"
            />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div className={styles.welcome}>
        <StarfieldAnimation
          style={{
            position: "absolute",
            width: "90%",
            height: "80%",
          }}
        ></StarfieldAnimation>

        <h5>
          Welcome.Please <a href="/login">Login!</a>
        </h5>
        <h6>
          Don't have an account yet? <a href="/register">Sign Up</a>{" "}
        </h6>
      </div>
    );
  }
}
export default Home;
