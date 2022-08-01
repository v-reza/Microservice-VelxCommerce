import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import NewAddress from "../../pages/MyProfile/NewAddress";
import { AuthContext } from "../../context/UserContext";
import { axiosGet } from "../../helper/axiosHelper";
import ViewEditAddress from "../../pages/MyProfile/ViewEditAddress";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ShippingAddress = ({
  setToast,
  setMessage,
  setError,
  setLoading,
  setChooseShippingAddress,
}) => {
  
  const [openViewEdit, setOpenViewEdit] = useState(false);
  const [openNewAddress, setOpenNewAddress] = useState(false);
  const { token } = useContext(AuthContext);
  const [listAddress, setListAddress] = useState({});

  const [chooseAddress, setChooseAddress] = useState(null);
  const [listViewAddress, setListViewAddress] = useState([]);

  //refresh
  const [refreshProfile, setRefreshProfile] = useState(false);

  //handle view edit address
  const handleViewEditAddress = async (e, address) => {
    e.preventDefault();
    setListViewAddress(address);
    setOpenViewEdit(true);
  };

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

  useEffect(() => {
    if (chooseAddress) {
      setChooseShippingAddress(chooseAddress);
    }
  }, [chooseAddress, setChooseShippingAddress]);

  return (
    <>
      <h2 className="text-xl font-semibold mb-5">Shipping Address</h2>

      <div className="">
        <div className="overflow-hidden sm:rounded-md">
          <div className="px-1 py-2 sm:p-6">
            <button
              type="button"
              onClick={() => setOpenNewAddress(true)}
              className="mb-4 inline-flex items-center rounded-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <AddIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Address
            </button>
            {/* <button
              onClick={() => setOpenNewAddress(true)}
              type="button"
              className="flex space-x-2 items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-grey-300 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-300 dark:text-white dark:border-gray-600 dark:hover:bg-purple-600 dark:hover:bg-purple-600 dark:focus:ring-gray-700"
            >
              <AddIcon />
              New Address
            </button> */}
            <NewAddress
              open={openNewAddress}
              setOpen={setOpenNewAddress}
              setToast={setToast}
              setMessage={setMessage}
              setError={setError}
              setLoading={setLoading}
              setRefreshProfile={setRefreshProfile}
            />
            <div className="grid sm:grid-cols-1 gap-3 mb-6">
              
              {listAddress && listAddress.length > 0
                ? listAddress.map((address, index) => (
                    <label
                      key={address._id}
                      onClick={() => setChooseAddress(address)}
                      className={classNames(
                        Boolean(address.isPrimary)
                          ? "border-2 border-indigo-500"
                          : "border border-gray-300",
                        "bg-white flex p-3 space-x-2 justify-between rounded-md bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                      )}
                    >
                      <span>
                        <input
                          name="shippingAddress"
                          type="radio"
                          className="h-4 w-4"
                          checked={address._id === chooseAddress?._id}
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
        </div>
      </div>
    </>
  );
};

export default ShippingAddress;
