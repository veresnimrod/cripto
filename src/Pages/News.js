import axios from "axios";
import React from "react";
import { useState, useEffect } from "react/cjs/react.development";
import styles from "../Components/Css/News.module.css";
import Pagination from "../Components/Pagination";
import Navbar from "../Components/Navbar";

export const News = () => {
  const [information, setInformation] = useState(null);
  const [currentDate, setcurrentDate] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [newsperPage] = useState(4);
  const newsUrl = {
    method: "GET",
    url: "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=c1f11784a64e40b9a9229a0383b486a2",
  };
  useEffect(() => {
    axios.request(newsUrl).then((response) => {
      setInformation(response.data);
    });
  }, []);

  useEffect(() => {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    setcurrentDate(date + "/" + month + "/" + year);
  });
  if (information) {
    const myNews = [];
    for (let i = 0; i < 20; i++) {
      myNews.push(information.articles[i]);
    }
    const indexOfLastNews = currentPage * newsperPage;
    const indexOfFirstNews = indexOfLastNews - newsperPage;
    const currentNews = information.articles?.slice(
      indexOfFirstNews,
      indexOfLastNews
    );
    const paginate = (pageElem) => setcurrentPage(pageElem);

    return (
      <>
        <Navbar />
        <div className={styles.title}>
          <h1>Today's news</h1>
        </div>
        <div className={styles.date}>
          <h3>{currentDate}</h3>
        </div>
        <div className={styles.container}>
          {currentNews?.map((article) => (
            <div className={styles.article}>
              <div
                className={styles.articletext}
                onClick={() => {
                  window.open(article.url);
                }}
              >
                <ul className={styles.list}>
                  <li key={article.author}>
                    <h1>{article.author}</h1>
                    <h1>{article.title} </h1>
                    <h2>{article.content}</h2>
                    <h2>{article.publishedAt}</h2>
                  </li>
                </ul>
              </div>
              <div className={styles.articleimgholder}>
                <img
                  src={article.urlToImage}
                  className={styles.articleimg}
                ></img>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          totalNews={myNews.length}
          newsperPage={newsperPage}
          paginate={paginate}
        ></Pagination>
      </>
    );
  } else return <></>;
};
export default News;
