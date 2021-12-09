import { NavLink } from "react-router-dom";
import styles from "./Css/Navbar.module.css";
import { useAuth } from "../Components/Auth.context";
import { useHistory } from "react-router";
import Logo from './logo.png';

export default function Navbar() {
  const { auth, logout } = useAuth();

  const history = useHistory();

  function handleLogout(e) {
    e.preventDefault();
    logout();
    history.push("/login");
  }
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={Logo} className={styles.logo}></img>
      </div>
      <div className={styles.pages}>
        <li>
          <NavLink exact to="/" activeClassName={styles.active}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/crypto" activeClassName={styles.active}>
            Crypto
          </NavLink>
        </li>
        <li>
          <NavLink to="/cryptoS" activeClassName={styles.active}>
            Crypto S
          </NavLink>
        </li>
        <li>
          <NavLink to="/news" activeClassName={styles.active}>
            News
          </NavLink>
        </li>
      </div>
      <div className={styles.account}>
        {!auth?.user && (
          <>
            <li className="">
              <NavLink to="/register" activeClassName={styles.active}>
                Sign Up
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" activeClassName={styles.active}>
                Log In
              </NavLink>
            </li>
          </>
        )}
        {auth?.user && (
          <>
            <li className={styles.username}>
              <a href={"/profile/?userId=" + auth?.user.id}>
                {auth.user.username}
              </a>
            </li>
            <li>
              <a href="/" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </>
        )}
      </div>
    </div>
  );
}
