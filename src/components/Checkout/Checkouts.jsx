import React from "react";

const Checkouts = () => {
  return (
    <>
      <section className="py-10 bg-gray-50">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
            <main className="md:w-2/3">
              
              {/* card.// */}
              <article className="border border-gray-200 bg-white shadow-sm rounded p-4 lg:p-6 mb-5">
                <h2 className="text-xl font-semibold mb-5">Personal Information</h2>
                <div className="grid grid-cols-2 gap-x-3">
                  <div className="mb-4">
                    <label className="block mb-1"> First name </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="text"
                      placeholder="Type here"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1"> Last name </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="text"
                      placeholder="Type here"
                    />
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-x-3">
                  <div className="mb-4">
                    <label className="block mb-1"> Phone </label>
                    <div className="flex  w-full">
                      <input
                        className="appearance-none w-24 border border-gray-200 bg-gray-100 rounded-tl-md rounded-bl-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400"
                        type="text"
                        placeholder="Code"
                        defaultValue={+998}
                      />
                      <input
                        className="appearance-none flex-1 border border-gray-200 bg-gray-100 rounded-tr-md rounded-br-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400"
                        type="text"
                        placeholder="Type phone"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1"> Email </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="email"
                      placeholder="Type here"
                    />
                  </div>
                </div>
                <label className="flex items-center w-max my-4">
                  <input
                    defaultChecked=""
                    name=""
                    type="checkbox"
                    className="h-4 w-4"
                  />
                  <span className="ml-2 inline-block text-gray-500">
                    {" "}
                    I agree with Terms and Conditions{" "}
                  </span>
                </label>
                <hr className="my-4" />
                <h2 className="text-xl font-semibold mb-5">
                  Shipping information
                </h2>
                {/* radio selection */}
                <div className="grid sm:grid-cols-3 gap-3 mb-6">
                  <label className="flex p-3 border border-gray-200 rounded-md bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer">
                    <span>
                      <input
                        name="shipping"
                        type="radio"
                        className="h-4 w-4 mt-1"
                      />
                    </span>
                    <p className="ml-2">
                      <span>Express delivery</span>
                      <small className="block text-sm text-gray-400">
                        3-4 days via Fedex
                      </small>
                    </p>
                  </label>
                  <label className="flex p-3 border border-gray-200 rounded-md bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer">
                    <span>
                      <input
                        name="shipping"
                        type="radio"
                        className="h-4 w-4 mt-1"
                      />
                    </span>
                    <p className="ml-2">
                      <span>Post office</span>
                      <small className="block text-sm text-gray-400">
                        20-30 days via post
                      </small>
                    </p>
                  </label>
                  <label className="flex p-3 border border-gray-200 rounded-md bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer">
                    <span>
                      <input
                        name="shipping"
                        type="radio"
                        className="h-4 w-4 mt-1"
                      />
                    </span>
                    <p className="ml-2">
                      <span>Self pick-up</span>
                      <small className="block text-sm text-gray-400">
                        Nearest location
                      </small>
                    </p>
                  </label>
                </div>
                {/* radio selection .//end */}
                <div className="grid md:grid-cols-3 gap-x-3">
                  <div className="mb-4 md:col-span-2">
                    <label className="block mb-1"> Address* </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="text"
                      placeholder="Type here"
                    />
                  </div>
                  <div className="mb-4 md:col-span-1">
                    <label className="block mb-1"> City* </label>
                    <div className="relative">
                      <select className="block appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full">
                        <option>Select here</option>
                        <option>Second option</option>
                        <option>Third option</option>
                      </select>
                      <i className="absolute inset-y-0 right-0 p-2 text-gray-400">
                        <svg
                          width={22}
                          height={22}
                          className="fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M7 10l5 5 5-5H7z" />
                        </svg>
                      </i>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-x-3">
                  <div className="mb-4 md:col-span-1">
                    <label className="block mb-1"> House </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="text"
                      placeholder="Type here"
                    />
                  </div>
                  <div className="mb-4 md:col-span-1">
                    <label className="block mb-1"> Building </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="text"
                      placeholder="Type here"
                    />
                  </div>
                  <div className="mb-4 md:col-span-1">
                    <label className="block mb-1"> ZIP code </label>
                    <input
                      className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                      type="text"
                      placeholder="Type here"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-1"> Other info </label>
                  <textarea
                    placeholder="Type your wishes"
                    className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                    defaultValue={""}
                  />
                </div>
                <label className="flex items-center w-max my-4">
                  <input
                    defaultChecked=""
                    name=""
                    type="checkbox"
                    className="h-4 w-4"
                  />
                  <span className="ml-2 inline-block text-gray-500">
                    {" "}
                    Save my information for future purchase{" "}
                  </span>
                </label>
                <div className="flex justify-end space-x-2">
                  <a
                    className="px-5 py-2 inline-block text-gray-700 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:text-blue-600"
                    href="#"
                  >
                    {" "}
                    Back
                  </a>
                  <a
                    className="px-5 py-2 inline-block text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                    href="#"
                  >
                    {" "}
                    Continue{" "}
                  </a>
                </div>
              </article>{" "}
              {/* card.// */}
            </main>
            <aside className="md:w-1/3">
              <article className="text-gray-600" style={{ maxWidth: 350 }}>
                <h2 className="text-lg font-semibold mb-3">Summary</h2>
                <ul>
                  <li className="flex justify-between mb-1">
                    <span>Total price:</span>
                    <span>$245.97</span>
                  </li>
                  <li className="flex justify-between mb-1">
                    <span>Discount:</span>
                    <span className="text-green-500">- $60.00</span>
                  </li>
                  <li className="flex justify-between mb-1">
                    <span>TAX:</span>
                    <span>$14.00</span>
                  </li>
                  <li className="border-t flex justify-between mt-3 pt-3">
                    <span>Total price:</span>
                    <span className="text-gray-900 font-bold">$420.00</span>
                  </li>
                </ul>
                <hr className="my-4" />
                <div className="flex gap-3">
                  <input
                    className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
                    type="text"
                    placeholder="Coupon code"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 inline-block text-gray-700 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:text-blue-600"
                  >
                    {" "}
                    Apply
                  </button>
                </div>
                <hr className="my-4" />
                <h2 className="text-lg font-semibold mb-3">Items in cart</h2>
                <figure className="flex items-center mb-4 leading-5">
                  <div>
                    <div className="block relative w-20 h-20 rounded p-1 border border-gray-200">
                      <img
                        width={70}
                        height={70}
                        src="images/items/1.jpg"
                        alt="Title"
                      />
                      <span className="absolute -top-2 -right-2 w-6 h-6 text-sm text-center flex items-center justify-center text-white bg-gray-400 rounded-full">
                        {" "}
                        1{" "}
                      </span>
                    </div>
                  </div>
                  <figcaption className="ml-3">
                    <p>
                      {" "}
                      GoPRO Action Camera <br /> Model: G-200{" "}
                    </p>
                    <p className="mt-1 text-gray-400"> Total: $12.99 </p>
                  </figcaption>
                </figure>
                <figure className="flex items-center mb-4 leading-5">
                  <div>
                    <div className="block relative w-20 h-20 rounded p-1 border border-gray-200">
                      <img
                        width={70}
                        height={70}
                        src="images/items/2.jpg"
                        alt="Title"
                      />
                      <span className="absolute -top-2 -right-2 w-6 h-6 text-sm text-center flex items-center justify-center text-white bg-gray-400 rounded-full">
                        {" "}
                        2{" "}
                      </span>
                    </div>
                  </div>
                  <figcaption className="ml-3">
                    <p> Modern Product Name Here </p>
                    <p className="mt-1 text-gray-400"> Total: $12.99 </p>
                  </figcaption>
                </figure>
                <figure className="flex items-center mb-4 leading-5">
                  <div>
                    <div className="block relative w-20 h-20 rounded p-1 border border-gray-200">
                      <img
                        width={70}
                        height={70}
                        src="images/items/8.jpg"
                        alt="Title"
                      />
                      <span className="absolute -top-2 -right-2 w-6 h-6 text-sm text-center flex items-center justify-center text-white bg-gray-400 rounded-full">
                        {" "}
                        5{" "}
                      </span>
                    </div>
                  </div>
                  <figcaption className="ml-3">
                    <p>
                      {" "}
                      Another Best Product <br /> Name Goes Here{" "}
                    </p>
                    <p className="mt-1 text-gray-400"> Total: $12.99 </p>
                  </figcaption>
                </figure>
              </article>
            </aside>{" "}
            {/* col.// */}
          </div>{" "}
          {/* grid.// */}
        </div>{" "}
        {/* container.// */}
      </section>
    </>
  );
};

export default Checkouts;
