import React, { useContext } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import "./navbar.css";
import { AuthContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Cart from "../Cart/Cart";
import { useLocation } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
const Navbar = (props) => {
  const { user, token, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    window.location.reload();
  };

  const navigateMenu = (e, to) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <div className="navContainer">
      <ul className="navLinks">
        <li
          className={location.pathname === "/" ? "menu nav-active" : "menu"}
          onClick={(e) => navigateMenu(e, "/")}
        >
          <span>Dashboard</span>
        </li>
        <li
          className={
            location.pathname === "/history" ? "menu nav-active" : "menu"
          }
          onClick={(e) => navigateMenu(e, "/history")}
        >
          <span>Transaction</span>
        </li>
      </ul>
      <div className="cta">
        <div className="buttonWrapper">
          <StorefrontIcon
            onClick={() =>
              window.open(
                `http://localhost:3100/session/signin?access-token=${token}`,
                "_blank",
                "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=5000,height=5000"
              )
            }
          />
          {props.checkout ? (
            <Cart
              checkout
              parentRefresh={props.parentRefresh}
              setCartNavbarRefresh={props.setCartNavbarRefresh}
            />
          ) : (
            <Cart
              parentRefresh={props.parentRefresh}
              setParentRefresh={props.setParentRefresh}
            />
          )}
          {user ? <LogoutIcon onClick={handleLogout} /> : "Login"}
        </div>
      </div>
    </div>
    // <div className="navbarContainer">
    //     <div className="navbarLeft">
    //         asd
    //     </div>
    //     <div className="navbarCenter">
    //         center
    //     </div>
    // </div>
  );
};

export default Navbar;
