/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/UserContext";
import Loading from "../../custom/Loading/Loading";
import Toast from "../../custom/Toast/Toast";
import { axiosPost } from "../../helper/axiosHelper";
import { useFolder } from "../../helper/useFolder";

const Summary = ({
  totalPrice,
  tax,
  grandTotal,
  shipping,
  chooseShipping,
  products,
  chooseShippingAddress,
}) => {
  const { user } = useContext(AuthContext);
  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const folder = useFolder();

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (chooseShipping.length === 0 || chooseShippingAddress.length === 0) {
      setLoading(false);
      setToast(true);
      setError(true);
      setMessage("Please choose shipping address and shipping method");
      // setMessage("Please choose shipping price option");
      return;
    }

    await axiosPost("/transaction", {
      userId: user._id,
      tax: tax,
      shippingAddress: chooseShippingAddress,
    })
      .then((res) => {
        setLoading(false);
        const snapToken = res.data.snapToken;
        window.parent.postMessage(
          { message: "The message is being set up here" },
          "*"
        );
        window.snap.pay(`${snapToken}`, {
          onSuccess: function (result) {
            navigate("/checkout/finish?id=" + result.transaction_id);
          },
          onPending: function (result) {
            navigate("/checkout/finish?id=" + result.transaction_id);
          },
          onError: function (result) {
            navigate("/checkout/finish?id=" + result.transaction_id);
          },
          onClose: function () {},
        });
      })
      .catch((err) => {
        setError(true);
        setToast(true);
        setMessage("Somethin when wrong when snap pay");
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
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* Order summary */}
      <div className="mt-10 lg:mt-0">
        <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

        <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="sr-only">Items in your cart</h3>
          <ul role="list" className="divide-y divide-gray-200">
            {products.map((product) => (
              <li key={product._id} className="flex py-6 px-4 sm:px-6">
                <div className="flex-shrink-0">
                  <img
                    src={
                      product.cart[0].product_image
                        ? folder + product.cart[0].product_image
                        : folder + "/noProductImage.png"
                    }
                    alt=""
                    className="w-20 rounded-md"
                  />
                </div>

                <div className="ml-6 flex-1 flex flex-col">
                  <div className="flex">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm">
                        <div className="font-medium text-gray-700 hover:text-gray-800">
                          {product.cart[0].product_name}
                        </div>
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Qty: {product.qty}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.size}
                      </p>
                    </div>

                    <div className="ml-4 flex-shrink-0 flow-root">
                      <button
                        type="button"
                        className="-m-2.5 bg-white p-2.5 flex items-center justify-center text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Remove</span>
                        
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 pt-2 flex items-end justify-between">
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      Subtotal : $
                      {parseInt(product.cart[0].product_price) * product.qty}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
            <div className="flex items-center justify-between">
              <dt className="text-sm">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">
                ${totalPrice}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm">Discount</dt>
              <dd className="text-sm font-medium text-green-500">-$0.00</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm">Shipping</dt>
              <dd className="text-sm font-medium text-red-500">${shipping}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm">Taxes</dt>
              <dd className="text-sm font-medium text-gray-900">${tax}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <dt className="text-base font-medium">Grand Total</dt>
              <dd className="text-base font-medium text-gray-900">
                ${grandTotal}
              </dd>
            </div>
          </dl>

          <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
            <button
              onClick={handlePay}
              type="button"
              className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
            >
              Confirm order
            </button>
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
    </>
  );
};

export default Summary;
