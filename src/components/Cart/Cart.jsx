/* eslint-disable jsx-a11y/no-redundant-roles */
import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useFolder } from "../../helper/useFolder";
import Toast from "../../custom/Toast/Toast";
import Loading from "../../custom/Loading/Loading";
import { AuthContext } from "../../context/UserContext";
import { axiosDelete, axiosPut } from "../../helper/axiosHelper";
import { useNavigate } from "react-router-dom";

export default function Cart({ open, setOpen, setCartRefresh, products }) {
  const folder = useFolder();
  const [subTotal, setSubTotal] = useState(0);
  const { user, dispatch } = useContext(AuthContext);
  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate()

  /**
   * Get Subtotal
   */
  useEffect(() => {
    const getSubTotal = () => {
      const subTotal = [];
      // eslint-disable-next-line array-callback-return
      products.map((product) => {
        subTotal.push(parseInt(product.cart[0].product_price) * product.qty);
      });

      setSubTotal(subTotal.reduce((prevVal, nextVal) => prevVal + nextVal, 0));
    };
    getSubTotal();
  }, [products]);

  /**
   * Handle Add & Reduce Quantity
   */
  const handleArrow = async (e, key, productId) => {
    e.preventDefault();
    try {
      const msg =
        key === "-"
          ? "Success reduce quantity product"
          : "Success plus quantity product";
      setLoading(true);
      const updateCart = await axiosPut(`/users/cart/${productId}/${key}`, {
        userId: user._id,
      });
      setLoading(false);
      setCartRefresh(true);
      if (updateCart.data.pull) {
        dispatch({ type: "DELETE_CART", payload: updateCart.data.productId });
        setToast(true);
        setMessage("Success delete cart product");
      } else {
        setToast(true);
        setMessage(msg);
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setToast(true);
      setMessage("Something went wrong when handle quantity");
    }
  };

  /**
   * Handle Delete Product in cart
   */
  const handleDelete = async (e, productId) => {
    e.preventDefault();
    try {
      setLoading(true);
      const deleteCart = await axiosDelete(`/users/cart/${productId}`, {
        data: {
          userId: user._id,
        },
      });
      setCartRefresh(true);
      dispatch({ type: "DELETE_CART", payload: deleteCart.data.productId });
      setLoading(false);
      setToast(true);
      setMessage("Success Delete Product");
    } catch (error) {
      setError(true);
      setToast(true);
      setMessage("Something went wrong when delete product in cart");
    }
  };

  /**
   * Navigate Checkout
   */
  const navigateCheckout = (e) => {
    e.preventDefault()
    setOpen(false)
    navigate("/checkout")
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          {" "}
                          Shopping cart{" "}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {products && products.length > 0 ? (
                              products.map((product) => (
                                <li key={product._id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={
                                        product.cart[0].product_image
                                          ? folder +
                                            product.cart[0].product_image
                                          : folder + "/noProductImage.png"
                                      }
                                      alt=""
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <div>
                                            {" "}
                                            {product.cart[0].product_name}{" "}
                                          </div>
                                        </h3>
                                        <p className="ml-4">
                                          ${product.cart[0].product_price}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        Red
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 cursor-pointer"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        onClick={(e) =>
                                          handleArrow(e, "-", product._id)
                                        }
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M18 12H6"
                                        />
                                      </svg>
                                      <p className="text-gray-500">
                                        Qty {product.qty}
                                      </p>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 cursor-pointer"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        onClick={(e) =>
                                          handleArrow(e, "+", product._id)
                                        }
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                      </svg>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-indigo-600 hover:text-indigo-500"
                                          onClick={(e) =>
                                            handleDelete(e, product._id)
                                          }
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <span className="flex justify-content-start mt-3">
                                No Product Found in cart
                              </span>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${subTotal}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <div className="mt-6">
                        {products.length > 0 ? (
                          <div 
                          className="cursor-pointer flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                          onClick={navigateCheckout}
                          >
                          
                            Checkout
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          {products.length > 0 ? "or " : ""}
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
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
      </Dialog>
    </Transition.Root>
  );
}
