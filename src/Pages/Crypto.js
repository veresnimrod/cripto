import React from "react";
import axios from "axios";
import styles from "../Components/Css/Crypto.module.css";
import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { Coins } from "../Components/Coins";
import Navbar from "../Components/Navbar";

export const Crypto = () => {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=120&page=1&sparkline=false";
  const [coins, setCoins] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(url).then((response) => {
      setCoins(response.data);
    });
  }, []);

  const filteredCoins = coins?.filter((coin) =>
    coin.name.toLowerCase().includes(search)
  );
  const handleChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };
  return (
    <div>
      <Navbar />
      <div className={styles.search}>
        <h1>Search a currency</h1>
        <input type="text" placeholder="Search" onChange={handleChange}></input>
      </div>
      <div>
        <Coins coins={filteredCoins} />
      </div>
    </div>
  );
};
export default Crypto;
