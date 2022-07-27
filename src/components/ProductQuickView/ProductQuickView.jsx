/*
  This example requires Tailwind CSS v2.0+ 
  
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { StarIcon } from "@heroicons/react/solid";
import { useFolder } from "../../helper/useFolder";
import { axiosPost } from "../../helper/axiosHelper";
import { AuthContext } from "../../context/UserContext";

const product = {
  name: "Basic Tee 6-Pack ",
  price: "$192",
  rating: 3.9,
  reviewCount: 117,
  href: "#",
  imageSrc:
    "https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg",
  imageAlt: "Two each of gray, white, and black shirts arranged on table.",
  colors: [
    { name: "White", class: "bg-white", selectedClass: "ring-gray-400" },
    { name: "Gray", class: "bg-gray-200", selectedClass: "ring-gray-400" },
    { name: "Black", class: "bg-gray-900", selectedClass: "ring-gray-900" },
  ],
  sizes: [
    { name: "XXS", inStock: true },
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: true },
    { name: "XXL", inStock: true },
    { name: "XXXL", inStock: false },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductQuickView({
  open,
  setOpen,
  products,
  setNavbarRefresh,
  setLoading,
  setToast,
  setMessage,
  isToast,
  message,
  loading,
  setError,
}) {
  const folder = useFolder();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { user, dispatch } = useContext(AuthContext);
  const [productColor, setProductColor] = useState([]);
  const [productSize, setProductSize] = useState([]);

  useEffect(() => {
    setProductColor(products.product_color);
    setProductSize(products.product_size);
  }, [products]);

  const handleSelectedColor = (e, color) => {
    e.preventDefault();
    setSelectedColor(color);
  };

  const handleSelectedSize = (e, size) => {
    e.preventDefault();
    setSelectedSize(size);
  };

  const buyNow = async (productId) => {
    if (!selectedColor || !selectedSize) {
      setError(true);
      setToast(true);
      setMessage("Please select color and size");
      return;
    }
    try {
      setLoading(true);
      await axiosPost(`/users/addToCart/${productId}`, {
        userId: user._id,
      });

      if (!user.cart.includes(productId)) {
        dispatch({ type: "ADD_CART", payload: productId });
      }
      setError(false);
      setLoading(false);
      setToast(true);
      setMessage("Success Add to cart ");
      setNavbarRefresh(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="hidden fixed inset-0 bg-gray-500 bg-opacity-30 transition-opacity md:block" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-stretch md:items-center justify-center min-h-full text-center md:px-2 lg:px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                enterTo="opacity-100 translate-y-0 md:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              >
                <Dialog.Panel className="flex text-base text-left transform transition w-full md:max-w-2xl md:px-4 md:my-8 lg:max-w-4xl">
                  <div className="w-full relative flex items-center bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                    <button
                      type="button"
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="w-full grid grid-cols-1 gap-y-8 gap-x-6 items-start sm:grid-cols-12 lg:gap-x-8">
                      <div className="aspect-w-2 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden sm:col-span-4 lg:col-span-5">
                        <img
                          src={
                            products.product_image
                              ? folder + products.product_image
                              : folder + "/noProductImage.png"
                          }
                          alt=""
                          className="object-center object-cover"
                        />
                      </div>
                      <div className="sm:col-span-8 lg:col-span-7">
                        <h2 className="text-2xl font-extrabold text-gray-900 sm:pr-12">
                          {products.product_name}
                        </h2>

                        <section
                          aria-labelledby="information-heading"
                          className="mt-2"
                        >
                          <h3 id="information-heading" className="sr-only">
                            Product information
                          </h3>

                          <p className="text-2xl text-gray-900">
                            ${products.product_price}
                          </p>

                          {/* Reviews */}
                          <div className="mt-6">
                            <h4 className="sr-only">Reviews</h4>
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                  <StarIcon
                                    key={rating}
                                    className={classNames(
                                      product.rating > rating
                                        ? "text-gray-900"
                                        : "text-gray-200",
                                      "h-5 w-5 flex-shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                              <p className="sr-only">
                                {product.rating} out of 5 stars
                              </p>
                              <div className="cursor-pointer ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                {product.reviewCount} reviews
                              </div>
                            </div>
                          </div>
                        </section>

                        <section
                          aria-labelledby="options-heading"
                          className="mt-10"
                        >
                          <h3 id="options-heading" className="sr-only">
                            Product options
                          </h3>

                          <form>
                            {/* Colors */}
                            <div>
                              <h4 className="text-sm text-gray-900 font-medium">
                                Color
                              </h4>

                              <RadioGroup className="mt-4">
                                <RadioGroup.Label className="sr-only">
                                  Choose a color
                                </RadioGroup.Label>
                                <span className="flex items-center space-x-3">
                                  {productColor?.map((color, index) => (
                                    <RadioGroup.Option
                                      key={index}
                                      value={color}
                                      className={classNames(
                                        color === selectedColor
                                          ? "ring ring-offset-1 ring-2 ring-gray-400"
                                          : "",
                                        "-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                                      )}
                                      onClick={(e) =>
                                        handleSelectedColor(e, color)
                                      }
                                    >
                                      <RadioGroup.Label
                                        as="span"
                                        className="sr-only"
                                      >
                                        Color
                                      </RadioGroup.Label>
                                      <span
                                        aria-hidden="true"
                                        className="h-8 w-8 border border-black border-opacity-10 rounded-full"
                                        style={{ backgroundColor: `#${color}` }}
                                      />
                                    </RadioGroup.Option>
                                  ))}
                                </span>
                              </RadioGroup>
                            </div>

                            {/* Sizes */}
                            <div className="mt-10">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm text-gray-900 font-medium">
                                  Size
                                </h4>
                                <div className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                  Size guide
                                </div>
                              </div>

                              <RadioGroup className="mt-4">
                                <RadioGroup.Label className="sr-only">
                                  Choose a size
                                </RadioGroup.Label>
                                <div className="grid grid-cols-4 gap-4">
                                  {productSize?.map((size, index) => (
                                    <RadioGroup.Option
                                      key={index}
                                      value={size}
                                      onClick={(e) =>
                                        handleSelectedSize(e, size)
                                      }
                                      // disabled={!size.inStock}
                                      className="bg-white shadow-sm text-gray-900 cursor-pointer group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1"
                                    >
                                      <>
                                        <RadioGroup.Label as="span">
                                          {size}
                                        </RadioGroup.Label>

                                        <span
                                          className={classNames(
                                            size === selectedSize
                                              ? "border-2 border-indigo-500"
                                              : "",
                                            "absolute -inset-px rounded-md"
                                          )}
                                          aria-hidden="true"
                                        />
                                      </>
                                    </RadioGroup.Option>
                                  ))}
                                </div>
                              </RadioGroup>
                            </div>

                            <div
                              onClick={() => buyNow(products._id)}
                              className="cursor-pointer mt-6 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Add to bag
                            </div>
                          </form>
                        </section>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
