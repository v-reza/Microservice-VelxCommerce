import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import CheckoutCart from "../../components/CheckoutCart/CheckoutCart";
import "./checkout.css";
import { useLocation } from "react-router-dom";
const Checkout = () => {
  const [parentRefresh, setParentRefresh] = useState(false);
  const location = useLocation();
  return (
    <>
      {location.pathname === "/checkout/cart" && (
        <Navbar
          checkout
          parentRefresh={parentRefresh}
          setCartNavbarRefresh={setParentRefresh}
        />
      )}
      <CheckoutCart setParentRefresh={setParentRefresh} />
    </>
  );
};

export default Checkout;
