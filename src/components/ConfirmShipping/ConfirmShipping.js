import React, { useContext, useEffect, useState } from "react";
import "./confirmshipping.css";
import Button from "@mui/material/Button";
import Toast from "../../custom/Toast/Toast";
import Loading from "../../custom/Loading/Loading";
import axios from "axios";
import { AuthContext } from "../../context/UserContext";
const ConfirmShipping = ({
  grandTotal,
  setGrandTotal,
  priceShipping,
  chooseShipping,
}) => {
  const { user } = useContext(AuthContext);
  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    // setGrandTotal(parseFloat(grandTotal) + parseFloat(priceShipping));
    setLoading(true);

    if (chooseShipping.length === 0) {
      setLoading(false);
      setToast(true);
      setError(true);
      setMessage("Please choose shipping price option");
      return;
    }

    await axios.post("/transaction", {
        userId: user._id,
        tax: priceShipping
    }).then(function (response) {
      setLoading(false);
      const snapToken = response.data.snapToken;
      console.log(snapToken)
      window.parent.postMessage(
        { message: "The message is being set up here" },
        "*"
      );
      window.snap.pay(`${snapToken}`, {
        onSuccess: function (result) {
          console.log("disini")
          axios.post('/transaction/callback', {
            result: result,
            userId: user._id
          })
        },
        onPending: function (result) {
          console.log("disini")
          axios.post('/transaction/callback', {
            result: result,
            userId: user._id
          })
        },
        onError: function (result) {
          console.log("disini")
          axios.post('/transaction/callback', {
            result: result,
            userId: user._id
          })
        },
        onClose: function () {

        },
      });
    }).catch((res) => {
      setError(true)
      setToast(true)
      setMessage("Somethin when wrong when snap pay")
    });
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
    <div className="container">
      <div className="row">
        <div className="col-md-12 mb-4">
          <div className="row resultContainer">
            <div className="col-md-12 d-flex">
              <div className="confirmWrapper">
                <div className="confirmDetail">
                  <span className="courier">
                    Grand Total : $
                    {parseFloat(grandTotal) + parseFloat(priceShipping)}
                  </span>
                </div>
              </div>
              <div className="confirmWrapper">
                <div className="confirmDetail confirmButton">
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "30px",
                      minWidth: "100px",
                      minHeight: "30px",
                    }}
                    onClick={(e) => handlePay(e)}
                  >
                    Pay
                  </Button>
                </div>
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

export default ConfirmShipping;
