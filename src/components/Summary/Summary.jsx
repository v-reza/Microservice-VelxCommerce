import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/UserContext";
import Loading from "../../custom/Loading/Loading";
import Toast from "../../custom/Toast/Toast";
import { axiosPost } from "../../helper/axiosHelper";

const Summary = ({ totalPrice, tax, grandTotal, shipping, chooseShipping }) => {
  const { user } = useContext(AuthContext);
  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (chooseShipping.length === 0) {
      setLoading(false);
      setToast(true);
      setError(true);
      setMessage("Please choose shipping price option");
      return;
    }

    await axiosPost("/transaction", {
      userId: user._id,
      tax: tax
    }).then((res) => {
      setLoading(false)
      const snapToken = res.data.snapToken;
      window.parent.postMessage(
        { message: "The message is being set up here" },
        "*"
      );
      window.snap.pay(`${snapToken}`, {
        onSuccess: function (result) {
          console.log("disini")
          axiosPost('/transaction/callback', {
            result: result,
            userId: user._id
          })
        },
        onPending: function (result) {
          console.log("disini")
          axiosPost('/transaction/callback', {
            result: result,
            userId: user._id
          })
        },
        onError: function (result) {
          console.log("disini")
          axiosPost('/transaction/callback', {
            result: result,
            userId: user._id
          })
        },
        onClose: function () {

        },
      });
    }).catch((err) => {
      setError(true)
      setToast(true)
      setMessage("Somethin when wrong when snap pay")
    })
  };

  useEffect(() => {
    const snapSrcUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = "SB-Mid-client--W_7vf6Uu8Wzufl-"; //change this according to your client-key
    // const myMidtransClientKey = "Mid-client-k5Od2zw8IBi00EJH"; //change this according to your client-key

    const script = document.createElement("script");
    script.src = snapSrcUrl;
    script.setAttribute("data-client-key", myMidtransClientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <h2 className="text-lg font-semibold mb-3">Summary</h2>
      <ul>
        <li className="flex justify-between mb-1">
          <span>Total price:</span>
          <span>${totalPrice}</span>
        </li>
        <li className="flex justify-between mb-1">
          <span>Discount:</span>
          <span className="text-green-500">- $0.00</span>
        </li>
        <li className="flex justify-between mb-1">
          <span>Tax:</span>
          <span>${tax}</span>
        </li>
        <li className="flex justify-between mb-1">
          <span>Shipping:</span>
          <span className="text-red-500">${shipping}</span>
        </li>
        <li className="border-t flex justify-between mt-3 pt-3">
          <span>Total price:</span>
          <span className="text-gray-900 font-bold">${grandTotal}</span>
        </li>
      </ul>
      <hr className="my-4" />
      <div className="flex gap-3">
        {/* <input
          className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
          type="text"
          placeholder="Coupon code"
        /> */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={(e) => handlePay(e)}
        >
          Pay
        </Button>
        {/* {" "}
          Pay
        </button> */}
      </div>
      <Toast
        open={isToast}
        setOpen={setToast}
        message={message}
        variant={error ? "error" : "success"}
      />
      <Loading open={loading} setOpen={setLoading} />
    </>
  );
};

export default Summary;
