import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./checkoutcart.css";
import Checkbox from "@mui/material/Checkbox";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Toast from "../../custom/Toast/Toast";
import Loading from "../../custom/Loading/Loading";
import { AuthContext } from "../../context/UserContext";
import axios from "axios";
import ShippingAddress from "../ShippingAddress/ShippingAddress";
import Shipping from "../Shipping/Shipping";
import ConfirmShipping from "../ConfirmShipping/ConfirmShipping";
const CheckoutCart = ({ setParentRefresh }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [qty, setQty] = useState([]);
  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [product, setProduct] = useState([]);
  const memoizedProduct = useMemo(() => qty, [qty]);
  const [city, setCity] = useState([]);
  const [priceShipping, setPriceShipping] = useState(0);
  const [grandTotal, setGrandTotal] = useState();
  const [chooseShipping, setChooseShipping] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // get grandtotal cart
  useEffect(() => {
    const getGrandTotal = async () => {
      const res = await axios.get(`/users/cart/${user._id}`);
      let arrGrandTotal = [];
      res.data.map((grand) =>
        arrGrandTotal.push(
          parseInt(grand.cart[0].product_price) * parseInt(grand.qty)
        )
      );
      setGrandTotal(arrGrandTotal.reduce((a, b) => a + b, 0));
    };
    getGrandTotal();
  }, [user._id, product]);

  //get kota from rajaongkir dan ngefilter nama kota yang tidak sama
  useEffect(() => {
    const getCity = async () => {
      const res = await axios.get("/rajaongkir/kota");
      setCity(
        res.data.rajaongkir.results.filter(
          (value, index, array) =>
            array.findIndex((v2) => v2.city_name === value.city_name) === index
        )
      );
    };
    getCity();
  }, []);

  const breakLine = () => {
    const breakLine = [10];
    return (
      <div>
        {breakLine.map((br) => (
          <React.Fragment key={br}>
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  };

  const handleChange = async (e, val) => {
    e.preventDefault();
    setError(false);
    const { value } = e.target;
    if (value !== "") {
      // const cart = await qty.findIndex((obj) => obj.cartId === val);
      // const setQuantity = (qty[cart].qty = value);
      // const getQuantity = await qty.findIndex((obj) => obj.cartId === val);
      setLoading(true);
      await axios.put(`/users/cart/${val}/change/quantity`, {
        userId: user._id,
        qty: value,
      });
      setRefresh(true);
      setParentRefresh(true);

      // setQty({ ...qty.find((f) => f.cartId === val), qty: value });
      setLoading(false);
      setToast(true);
      setMessage("Success update quantity");
    } else {
      setToast(true);
      setError(true);
      setMessage("Min input 1");
    }
  };

  const handleAdd = async (e, val) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    // const cart = qty.findIndex((obj) => obj.cartId === val);
    await axios.put(`/users/cart/${val}/+`, {
      userId: user._id,
    });
    setRefresh(true);
    setParentRefresh(true);
    setLoading(false);
    setToast(true);
    setMessage("Success add quantitity");
    // setQty(++qty[cart].qty);
  };

  const handleMin = async (e, val) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    // const cart = qty.findIndex((obj) => obj.cartId === val);
    // console.log(cart)
    // if (qty[cart].qty === 1) {
    //   setLoading(false);
    //   setToast(true);
    //   setMessage("Min input 1");
    //   setError(true);
    //   // setRefresh(true);
    //   return true;
    // } else {
    await axios.put(`/users/cart/${val}/-`, {
      userId: user._id,
    });
    setRefresh(true);
    setParentRefresh(true);
    setError(false);
    setLoading(false);
    setToast(true);
    setMessage("Success reduce quantity");
    // setQty(qty[cart].qty - 1);
    // }

    // setQty((val) => (val - 1 === 0 ? 1 : val - 1));
  };

  // const getQuantity = useCallback(() => {
  //   let array = [];
  //   product.map((p) =>
  //     array.push({
  //       cartId: p._id,
  //       qty: p.qty,
  //     })
  //   );
  //   setQty(array);
  // }, [product]);

  //get product from cart

  useEffect(() => {
    const getProduct = async () => {
      try {
        const fetchCart = await axios.get(`/users/cart/${user._id}`);
        setProduct(fetchCart.data);
      } catch (error) {
        setToast(true);
        setMessage("Something went wrong when fetch data");
        setError(true);
      }
    };
    getProduct();
    // getQuantity();
    setRefresh(false);
    console.log("refresh");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, user._id]);

  return (
    <div className="container">
      <div className="row">
        <div className="titleContainer">
          <div className="titleWrapper">
            <div className="verticalLine">Item in cart</div>
          </div>
        </div>
        {product &&
          product.map((p) => (
            <div className="col-md-12 mt-4" key={p._id}>
              <div className="row itemContainer">
                <div className="col-md-12 d-flex">
                  <Checkbox
                    defaultChecked
                    color="success"
                    sx={{ color: "green" }}
                  />
                  <div className="itemWrapper">
                    <div className="itemDetail">
                      <img
                        alt=""
                        className="img-thumbnail imgProduct"
                        src={
                          p.cart[0].product_image
                            ? PF + p.cart[0].product_image
                            : PF + "/noProductImage.png"
                        }
                      />
                      <div className="productDetail">
                        <span className="productName">
                          {p.cart[0].product_name}
                        </span>
                        <span className="productPrice">
                          ${p.cart[0].product_price}
                        </span>
                        <div className="productQty">
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={(e) => handleMin(e, p._id)}
                            style={{
                              maxWidth: "30px",
                              maxHeight: "30px",
                              minWidth: "30px",
                              minHeight: "30px",
                            }}
                          >
                            <RemoveIcon />
                          </Button>
                          <TextField
                            hiddenLabel
                            id="filled-hidden-label-small"
                            // value={
                            //   qty.length > 0
                            //     ? loading
                            //       ? p.qty
                            //       : qty.find((cart) => cart.cartId === p._id)
                            //           .qty
                            //     : p.qty
                            // }
                            value={p.qty}
                            variant="filled"
                            size="small"
                            type="number"
                            style={{ maxWidth: "80px", minWidth: "30px" }}
                            onChange={(e) => handleChange(e, p._id)}
                            InputProps={{
                              disableUnderline: true,
                              style: {
                                height: "32px",
                              },
                              inputProps: {
                                style: {
                                  textAlign: "center",
                                },
                              },
                            }}
                          />
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={(e) => handleAdd(e, p._id)}
                            style={{
                              maxWidth: "30px",
                              maxHeight: "30px",
                              minWidth: "30px",
                              minHeight: "30px",
                            }}
                          >
                            <AddIcon />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="subTotal">
                  Subtotal : $
                  {parseInt(p.cart[0].product_price) * parseInt(p.qty)}
                </div>
              </div>
            </div>
          ))}
        <div className="titleContainer">
          <div className="titleWrapper">
            <div className="verticalLine">Shipping Address</div>
          </div>
        </div>
        <ShippingAddress />
        <div className="titleContainer">
          <div className="titleWrapper">
            <div className="verticalLine">Shipping Price</div>
          </div>
        </div>
        <Shipping
          city={city}
          setPriceShipping={setPriceShipping}
          setChooseShipping={setChooseShipping}
        />
      </div>
      <div className="titleContainer">
        <div className="titleWrapper">
          <div className="verticalLine">Confirm Payment</div>
        </div>
      </div>
      <ConfirmShipping
        grandTotal={grandTotal}
        setGrandTotal={setGrandTotal}
        priceShipping={priceShipping}
        chooseShipping={chooseShipping}
      />
      {breakLine()}
      <Toast
        open={isToast}
        setOpen={setToast}
        message={message}
        variant={error ? "error" : "success"}
      />
      <Loading open={loading} setOpen={setLoading} />
    </div>
  );
};

export default CheckoutCart;
