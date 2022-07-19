import React, { useContext, useEffect, useState, useCallback } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./cart.css";
import { AuthContext } from "../../context/UserContext";
import axios from "axios";
import Offcanvas from "../Offcanvas/Offcanvas";
const Cart = (props) => {
  // console.log(props)
  const { user } = useContext(AuthContext);
  const [cartLength, setCartLength] = useState(false);
  const [product, setProduct] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCartLength = useCallback(async () => {
    const qty = [];
    const res = await axios.get(`/users/cart/${user._id}`);
    res.data.map((val) => qty.push(val.qty));
    setCartLength(qty.reduce((prevVal, nextVal) => prevVal + nextVal, 0));
  });

  useEffect(() => {
    getCartLength();
  }, [user._id, cartLength, getCartLength, props?.parentRefresh]);

  // const filterCountProductId = (productId) => {
  //   const count = {};
  //   const result = [];

  //   productId.forEach((item) => {
  //     if (count[item]) {
  //       count[item] += 1;
  //       return;
  //     }
  //     count[item] = 1;
  //   });

  //   for (let prop in count) {
  //     if (count[prop] >= 2) {
  //       result.push(prop);
  //     }
  //   }

  //   setCartItem(count);
  // };

  // useEffect(() => {
  //   const filterProductId = () => {
  //     setProductId(
  //       user.cart.filter((item, index) => user.cart.indexOf(item) === index)
  //     );
  //     filterCountProductId(user.cart);
  //   };
  //   filterProductId();
  // }, [user.cart]);

  // useEffect(() => {
  //   const filterLengthProductId = () => {
  //     let arr = [];
  //     productId.map((p) => arr.push(cartItem[p]));
  //     setProductIdWithLength(arr);
  //   };
  //   filterLengthProductId();
  // }, [cartItem, productId]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const fetchCart = await axios.get(`/users/cart/${user._id}`);

        setProduct(fetchCart.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
    setRefresh(false);
    if (props.checkout) {
      props.setCartNavbarRefresh(false);
    }
    if (props.parentRefresh) {
      props.setParentRefresh(false);
    }
  }, [
    refresh,
    user.cart,
    user._id,
    props.parentRefresh,
    props.setCartNavbarRefresh,
    props,
  ]);

  return (
    <div>
      <div
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasRight"
        aria-controls="offcanvasRight"
      >
        <ShoppingCartIcon className="cart" />
        <span className="badge badge-warning" id="lblCartCount">
          <span>{cartLength}</span>
        </span>
      </div>
      <Offcanvas product={product} setRefresh={setRefresh} />
    </div>
  );
};

export default Cart;
