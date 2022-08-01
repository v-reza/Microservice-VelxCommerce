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
      <div className="grid grid-cols-1 gap-x-3">
        <div className="mb-4">
          <label className="block mb-1"> Phone Number </label>
          <input
            className="cursor-not-allowed appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="text"
            placeholder="Type here"
            value={user.phone}
            disabled
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-3">
        <div className="mb-4">
          <label className="block mb-1"> Email </label>
          <input
            className="cursor-not-allowed appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="text"
            placeholder="Type here"
            value={user.email}
            disabled
          />
        </div>
      </div>

      {/* <div className="grid lg:grid-cols-2 gap-x-3">
        <div className="mb-4">
          <label className="block mb-1"> Phone </label>
          <div className="flex w-full"></div>
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
      </div> */}
      <div className="py-3 lg:pt-6 lg:pb-16 lg:col-start-1 lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
        {/* Description and details */}
        <div>
          <div className="space-y-6">
            <span className="text-base text-gray-500">
              {" "}
              This Personal Information a permanent data, If you want update data
              profile go to Settings{" "}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalInformation;
