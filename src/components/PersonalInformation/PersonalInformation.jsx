import React from "react";

const PersonalInformation = ({ user }) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-5">Personal Information</h2>
      <div className="grid grid-cols-1 gap-x-3">
        <div className="mb-4">
          <label className="block mb-1"> Full name </label>
          <input
            className="cursor-not-allowed appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="text"
            placeholder="Type here"
            value={user.name}
            disabled
          />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-x-3">
        <div className="mb-4">
          <label className="block mb-1"> Phone </label>
          <div className="flex  w-full">
            <input
              className="cursor-not-allowed appearance-none w-24 border border-gray-200 bg-gray-100 rounded-tl-md rounded-bl-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400"
              type="text"
              placeholder="Code"
              defaultValue={+62}
              disabled
            />
            <input
              className="cursor-not-allowed appearance-none flex-1 border border-gray-200 bg-gray-100 rounded-tr-md rounded-br-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400"
              type="text"
              placeholder="Type phone"
              value={user.phone}
              disabled
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1"> Email </label>
          <input
            className="cursor-not-allowed appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="email"
            placeholder="Type here"
            value={user.email}
            disabled
          />
        </div>
      </div>
      <label className="flex items-center w-max my-4">
        {/* <input defaultChecked="" name="" type="checkbox" className="h-4 w-4" /> */}
        <span className="ml-2 inline-block text-gray-500">
          {" "}
          If you want update data profile go to Settings{" "}
        </span>
      </label>
    </>
  );
};

export default PersonalInformation;
