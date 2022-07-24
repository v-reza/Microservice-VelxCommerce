import React, { useContext, useState, useEffect } from "react";
import { ShoppingBagIcon } from "@heroicons/react/outline";
import Cart from "../Cart/Cart";
import { AuthContext } from "../../context/UserContext";
import { axiosGet } from "../../helper/axiosHelper";
const CartIcon = (props) => {
  const [open, setOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState([]);
  const [cartRefresh, setCartRefresh] = useState(false);
  const [cartLength, setCartLength] = useState(0);

  /**
   * Get Cart Length
   */
  useEffect(() => {
    const getCartLength = async () => {
      const qty = [];
      const res = await axiosGet(`/users/cart/${user._id}`);
      res.data.map((val) => qty.push(val.qty));
      setCartLength(qty.reduce((prevVal, nextVal) => prevVal + nextVal, 0));
    };
    getCartLength();
  }, [user._id, props?.navbarRefresh, cartRefresh]);

  /**
   * Get Product on Cart
   */
  useEffect(() => {
    const getProduct = async () => {
      const res = await axiosGet(`/users/cart/${user._id}`);
      setProduct(res.data);
    };
    getProduct();
    setCartRefresh(false);

    /**
     * Props checkout on pages checkout & set refresh
     * Props navbarRefresh
     */
    // if (props.checkout) {
    //   props.setCartNavbarRefresh(false);
    // } else 
    if (props.navbarRefresh) {
      props.setNavbarRefresh(false);
    }
  }, [
    user._id,
    cartRefresh,
    props.navbarRefresh,
    props.setCartNavbarRefresh,
    props,
  ]);

  return (
    <>
      {/* Search */}
      <div className="flex lg:ml-6">
        <div
          className="p-2 text-gray-400 hover:text-gray-500 group -m-2 p-2 flex items-center cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <span className="sr-only">Cart</span>
          <ShoppingBagIcon
            className="flex-shrink-0 h-6 w-6 text-white group-hover:text-white hover:text-white"
            aria-hidden="true"
          />
          <span className="ml-2 text-sm font-medium text-red-300 group-hover:text-red-400">
            {cartLength}
          </span>
        </div>
      </div>
      <div className="flex lg:ml-6"></div>
      <Cart
        open={open}
        setOpen={setOpen}
        setCartRefresh={setCartRefresh}
        products={product}

      />
    </>
  );
};

export default CartIcon;
