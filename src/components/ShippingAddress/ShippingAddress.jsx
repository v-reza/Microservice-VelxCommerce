import React from "react";

const ShippingAddress = () => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-5">Billing Address</h2>
      <div className="grid md:grid-cols-3 gap-x-3">
        <div className="mb-4 md:col-span-3">
          <label className="block mb-1"> Address* </label>
          <input
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="text"
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-x-3">
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
        <div className="mb-4 md:col-span-1">
          <label className="block mb-1"> State / Province* </label>
          <input
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="text"
            placeholder="Type here"
          />
        </div>
        <div className="mb-4 md:col-span-1">
          <label className="block mb-1"> ZIP / Postal Code* </label>
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
        <input defaultChecked="" name="" type="checkbox" className="h-4 w-4" />
        <span className="ml-2 inline-block text-gray-500">
          {" "}
          Save my information for future purchase{" "}
        </span>
      </label>
    </>
  );
};

export default ShippingAddress;
