import React from "react";
import styles from "./Css/Pagination.module.css";

export const Pagination = ({ totalNews, newsperPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalNews / newsperPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className={styles.navbar}>
      <ul className={styles.list}>
        {pageNumbers.map((elem) => (
          <li key={elem} className={styles.listitem}>
            <a
              name="page"
              onClick={(e) => {
                e.preventDefault();
                paginate(elem);
              }}
              id={elem}
            >
              {elem}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default Pagination;
