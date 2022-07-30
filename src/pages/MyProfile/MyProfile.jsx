import AddIcon from "@mui/icons-material/Add";
import { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/UserContext";
import Loading from "../../custom/Loading/Loading";
import Toast from "../../custom/Toast/Toast";
import { axiosGet, axiosPut } from "../../helper/axiosHelper";
import NewAddress from "./NewAddress";
import ViewEditAddress from "./ViewEditAddress";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MyProfile() {
  const { user, token, dispatch } = useContext(AuthContext);
  const [openViewEdit, setOpenViewEdit] = useState(false);
  const [openNewAddress, setOpenNewAddress] = useState(false);
  const [listAddress, setListAddress] = useState({});

  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [chooseAddress, setChooseAddress] = useState(null);
  const [listViewAddress, setListViewAddress] = useState([]);

  //refresh
  const [refreshProfile, setRefreshProfile] = useState(false);

  //personal information
  const [disableInputFullName, setDisableInputFullName] = useState(true);
  const [disableInputEmail, setDisableInputEmail] = useState(true);
  const [disableInputPhone, setDisableInputPhone] = useState(true);
  const [disableButtonSave, setDisableButtonSave] = useState(true);
  const [inputFullName, setInputFullName] = useState(user.name);
  const [inputEmail, setInputEmail] = useState(user.email);
  const [inputPhone, setInputPhone] = useState(user.phone);

  useEffect(() => {
    const getListAddress = async () => {
      const res = await axiosGet("/address", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setListAddress(res.data);
    };
    getListAddress();
    setRefreshProfile(false);
  }, [token, refreshProfile]);

  const handleSubmitAddressPrimary = async (e) => {
    e.preventDefault();
    if (chooseAddress === null) {
      setToast(true);
      setError(true);
      setMessage("Please choose address");
      return;
    }
    setError(false);
    setLoading(true);
    await axiosPut(`/address/${chooseAddress._id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRefreshProfile(true);
    setLoading(false);
    setToast(true);
    setMessage("Successfully update primary address");
  };

  //handle view edit address
  const handleViewEditAddress = async (e, address) => {
    e.preventDefault();
    setListViewAddress(address);
    setOpenViewEdit(true);
  };

  //handle update profile information
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (inputFullName === user.name && inputEmail === user.email && inputPhone === user.phone) {
      setToast(true);
      setError(true);
      setMessage("Nothing to update");
      return;
    }
    setError(false);
    setLoading(true);
    const res = await axiosPut(
      `/users`,
      {
        name: inputFullName,
        email: inputEmail,
        phone: inputPhone,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({ type: "UPDATE_PROFILE_INFORMATION", payload: res.data });
    setRefreshProfile(true);
    setLoading(false);
    setToast(true);
    setMessage("Successfully update profile");
    setDisableButtonSave(true);
    setDisableInputFullName(true);
    setDisableInputEmail(true);
    setDisableInputPhone(true);
  };

  return (
    <Fragment>
      <div className="mt-3">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Profile
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                This information will be displayed publicly so be careful what
                you share.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form action="#" method="POST">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label
                        htmlFor="company-website"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Website
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          http://
                        </span>
                        <input
                          type="text"
                          name="company-website"
                          id="company-website"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="www.example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-700"
                    >
                      About
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="you@example.com"
                        defaultValue={""}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your profile. URLs are hyperlinked.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Photo
                    </label>
                    <div className="mt-1 flex items-center">
                      <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                      <button
                        type="button"
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cover photo
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Personal Information
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Use a permanent personal information you can receive mail.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form action="#" method="POST">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-6">
                      <label
                        htmlFor="first-name"
                        className="flex text-sm font-medium text-gray-700"
                      >
                        Full Name
                        {disableInputFullName ? (
                          <svg
                            onClick={() => {
                              setDisableInputFullName(false);
                              setDisableButtonSave(false);
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-1 w-4 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-1 w-4 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            onClick={() => {
                              setDisableInputFullName(true);
                              setInputFullName(user.name);
                              if (disableInputEmail && disableInputPhone) {
                                setDisableButtonSave(true);
                              }
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        className={classNames(
                          disableInputFullName
                            ? "cursor-not-allowed bg-gray-100 border border-gray-300 text-gray-900 text-sm"
                            : "",
                          "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        )}
                        value={inputFullName}
                        onChange={(e) => {
                          setInputFullName(e.target.value);
                        }}
                        disabled={disableInputFullName}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="email-address"
                        className="flex text-sm font-medium text-gray-700"
                      >
                        Email address
                        {disableInputEmail ? (
                          <svg
                            onClick={() => {
                              setDisableInputEmail(false);
                              setDisableButtonSave(false);
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-1 w-4 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-1 w-4 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            onClick={() => {
                              setDisableInputEmail(true);
                              setInputEmail(user.email);
                              if (disableInputFullName && disableInputPhone) {
                                setDisableButtonSave(true);
                              }
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </label>
                      <input
                        type="email"
                        name="email-address"
                        id="email-address"
                        autoComplete="email"
                        className={classNames(
                          disableInputEmail
                            ? "cursor-not-allowed bg-gray-100 border border-gray-300 text-gray-900 text-sm"
                            : "",
                          "mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        )}
                        value={inputEmail}
                        onChange={(e) => {
                          setInputEmail(e.target.value);
                        }}
                        disabled={disableInputEmail}
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="email-address"
                        className="flex text-sm font-medium text-gray-700"
                      >
                        Mobile Number
                        {disableInputPhone ? (
                          <svg
                            onClick={() => {
                              setDisableInputPhone(false);
                              setDisableButtonSave(false);
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-1 w-4 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-1 w-4 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            onClick={() => {
                              setDisableInputPhone(true);
                              setInputPhone(user.phone);
                              if (disableInputFullName && disableInputEmail) {
                                setDisableButtonSave(true);
                              }
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </label>
                      <div className="flex">
                        <span className="cursor-not-allowed inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                          +62
                        </span>
                        <input
                          type="number"
                          id="website-admin"
                          className={classNames(
                            disableInputPhone
                              ? "cursor-not-allowed bg-gray-100 border border-gray-300 text-gray-900 text-sm"
                              : "",
                            "rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          )}
                          onChange={(e) => setInputPhone(e.target.value)}
                          disabled={disableInputPhone}
                          placeholder={!inputPhone && "8965xxxxx"}
                          value={inputPhone}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    disabled={disableButtonSave}
                    type="button"
                    onClick={(e) => handleUpdateProfile(e)}
                    className={classNames(
                      disableButtonSave
                        ? "cursor-not-allowed bg-gray-100 border border-gray-300 text-black text-sm"
                        : "text-white  bg-indigo-600 hover:bg-indigo-700 ",
                      "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    )}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Personal Address
              </h3>
              <p className="mt-1 text-sm text-red-600">
                Use a permanent address where you can transaction.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form action="#" method="POST">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white sm:p-6">
                  <button
                    onClick={() => setOpenNewAddress(true)}
                    type="button"
                    className="flex space-x-2 items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-grey-300 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-300 dark:text-white dark:border-gray-600 dark:hover:bg-purple-600 dark:hover:bg-purple-600 dark:focus:ring-gray-700"
                  >
                    <AddIcon />
                    New Address
                  </button>
                  <NewAddress
                    open={openNewAddress}
                    setOpen={setOpenNewAddress}
                    setToast={setToast}
                    setMessage={setMessage}
                    setError={setError}
                    setLoading={setLoading}
                  />
                  <div className="grid sm:grid-cols-1 gap-3 mb-6">
                    {listAddress && listAddress.length > 0
                      ? listAddress.map((address, index) => (
                          <label
                            key={address._id}
                            onClick={() => setChooseAddress(address)}
                            className={classNames(
                              Boolean(address.isPrimary)
                                ? "border-2 border-indigo-300"
                                : "border border-gray-300",
                              "flex p-3 space-x-2 justify-between rounded-md bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                            )}
                          >
                            <span>
                              <input
                                name="shipping"
                                type="radio"
                                className="h-4 w-4"
                                checked={
                                  address.isPrimary ||
                                  address._id === chooseAddress?._id
                                }
                                onChange={() => {}}
                              />
                              <span
                                className={classNames(
                                  Boolean(address.isPrimary)
                                    ? "text-bold text-indigo-500"
                                    : "",
                                  "ml-2 text-center"
                                )}
                              >
                                {Boolean(address.isPrimary)
                                  ? "Primary Address"
                                  : `Address ${index + 1}`}
                              </span>
                              <small className="ml-6 mt-1 block text-sm text-gray-400">
                                {address.address}
                              </small>
                            </span>

                            <div
                              onClick={(e) => handleViewEditAddress(e, address)}
                              className="cursor-pointer text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 mr-2 mb-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 -ml-1 w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                              <span>View/Edit</span>
                            </div>
                          </label>
                        ))
                      : "No address found, please add new address"}
                  </div>
                  {listViewAddress && (
                    <ViewEditAddress
                      open={openViewEdit}
                      setOpen={setOpenViewEdit}
                      setToast={setToast}
                      listAddress={listViewAddress}
                      setMessage={setMessage}
                      setError={setError}
                      setLoading={setLoading}
                      setRefreshProfile={setRefreshProfile}
                    />
                  )}
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    onClick={(e) => handleSubmitAddressPrimary(e)}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Notifications
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Decide which communications you'd like to receive and how.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form action="#" method="POST">
              <div className="shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <fieldset>
                    <legend className="sr-only">By Email</legend>
                    <div
                      className="text-base font-medium text-gray-900"
                      aria-hidden="true"
                    >
                      By Email
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="comments"
                            name="comments"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="comments"
                            className="font-medium text-gray-700"
                          >
                            Comments
                          </label>
                          <p className="text-gray-500">
                            Get notified when someones posts a comment on a
                            posting.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="candidates"
                            name="candidates"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="candidates"
                            className="font-medium text-gray-700"
                          >
                            Candidates
                          </label>
                          <p className="text-gray-500">
                            Get notified when a candidate applies for a job.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="offers"
                            name="offers"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="offers"
                            className="font-medium text-gray-700"
                          >
                            Offers
                          </label>
                          <p className="text-gray-500">
                            Get notified when a candidate accepts or rejects an
                            offer.
                          </p>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="contents text-base font-medium text-gray-900">
                      Push Notifications
                    </legend>
                    <p className="text-sm text-gray-500">
                      These are delivered via SMS to your mobile phone.
                    </p>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="push-everything"
                          name="push-notifications"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor="push-everything"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Everything
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="push-email"
                          name="push-notifications"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor="push-email"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Same as email
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="push-nothing"
                          name="push-notifications"
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor="push-nothing"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          No push notifications
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
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
    </Fragment>
  );
}
