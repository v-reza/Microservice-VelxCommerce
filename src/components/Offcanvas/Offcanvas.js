import React, { useContext, useState } from "react";
import "./offcanvas.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Button from "@mui/material/Button";
import axios from "axios";
import { AuthContext } from "../../context/UserContext";
import Toast from "../../custom/Toast/Toast";
import Loading from "../../custom/Loading/Loading";
const Offcanvas = ({ product, setRefresh }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user, dispatch } = useContext(AuthContext);
  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)

  const handleArrow = async (e, key, val) => {
    setRefresh(true)
    try {
        const msg = key === "-" ? "Success reduce quantity product" : "Success plus quantity product" 
        setLoading(true);
        e.preventDefault();
        const updateCart = await axios.put(`/users/cart/${val}/${key}`, {
          userId: user._id,
        });
        setLoading(false);
        if (updateCart.data.pull) {
          dispatch({ type: "DELETE_CART", payload: updateCart.data.productId });
          setToast(true);
          setMessage("Success delete cart product");
        } else {
          setToast(true);
          setMessage(msg);
        }
    } catch (error) {
        console.log(error)
        setError(true)       
        setToast(true)
        setMessage("Something went wrong when fetch data")
    }
  };

  const handleDelete = async (e, val) => {
    setRefresh(true)
    try {
        setLoading(true)
        e.preventDefault()
        const deleteCart = await axios.delete(`/users/cart/${val}`, {
            data: {
                userId: user._id
            }
        })
        dispatch({type: "DELETE_CART", payload: deleteCart.data.productId})
        setLoading(false)
        setToast(true)
        setMessage("Success Delete Product")
        
    } catch (error) { 
        setError(true)       
        setToast(true)
        setMessage("Something went wrong when fetch data")
    }
  };

  return (
    <div>
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel" className="text-dark">
            Cart
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="container">
            <div className="row">
              {product &&
                product.map((p) => (
                  <React.Fragment key={p._id}>
                    <div className="col-md-4" key={p._id}>
                      <img
                        src={
                          p.cart[0].product_image
                            ? PF + p.cart[0].product_image
                            : PF + "/noProductImage.png"
                        }
                        className="img-thumbnail img-product"
                        alt=""
                      />
                    </div>
                    <div className="col-md-8">
                      <span className="text-dark">
                        {p.cart[0].product_name}
                      </span>
                      <div className="row text-black-50">
                        <div className="col-md-2 d-flex mt-3">
                          <ArrowBackIosIcon
                            onClick={(e) => handleArrow(e, "-", p._id)}
                          />
                        </div>
                        <div className="col-md-4 d-flex mt-3 align-items-center justify-content-center m-auto ">
                          <span>Qty: {p.qty}</span>
                        </div>
                        <div className="col-md-4 d-flex mt-3">
                          <ArrowForwardIosIcon
                            onClick={(e) => handleArrow(e, "+", p._id)}
                          />
                        </div>
                      </div>
                      <div className="row text-danger">
                        <div className="col-md-10 d-flex mt-2 align-items-center justify-content-center">
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            fullWidth
                            onClick={(e) => handleDelete(e, p._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              <div className="d-flex justify-content-center">
                {product && product.length === 0 ? (
                  <span className="text-dark">No Product Found</span>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => window.location.href = "/checkout/cart"}
                  >
                    <ShoppingCartCheckoutIcon /> Checkout
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default Offcanvas;
