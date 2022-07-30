import { Fragment, useState, useEffect, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { AuthContext } from "../../context/UserContext";
import axios from "axios";
import { axiosDelete, axiosPut } from "../../helper/axiosHelper";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ViewEditAddress({
  open,
  setOpen,
  listAddress,
  setToast,
  setMessage,
  setError,
  setLoading,
  setRefreshProfile,
}) {
  const [streetAddress, setStreetAddress] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState(null);
  const [listProvince, setListProvince] = useState([]);
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [listCity, setListCity] = useState([]);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const { token } = useContext(AuthContext);

  const onChangeProvince = async (provinceId) => {
    setSelectedProvinceId(provinceId);

    const provinceName = await axios.get(
      "http://dev.farizdotid.com/api/daerahindonesia/provinsi/" + provinceId
    );

    setSelectedProvinceName(provinceName.data.nama);

    const res = await axios.get(
      "http://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=" +
        provinceId
    );
    setListCity(res.data.kota_kabupaten);
  };

  const onChangeCity = async (cityId) => {
    setSelectedCityId(cityId);
    const cityName = await axios.get(
      "http://dev.farizdotid.com/api/daerahindonesia/kota/" + cityId
    );

    setSelectedCityName(cityName.data.nama);
  };

  useEffect(() => {
    const getProvince = async () => {
      const res = await axios.get(
        "http://dev.farizdotid.com/api/daerahindonesia/provinsi"
      );
      const filterProvince = res.data.provinsi.filter((item) => {
        return item.nama === listAddress.province;
      });
      setSelectedProvinceId(filterProvince[0]?.id);
      setListProvince(res.data.provinsi);

      const resCity = await axios.get(
        "http://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=" +
          filterProvince[0]?.id
      );
      const filterCity = resCity.data.kota_kabupaten.filter((item) => {
        return item.nama === listAddress.city;
      });
      setSelectedCityId(filterCity[0]?.id);
      setListCity(resCity.data.kota_kabupaten);
    };
    getProvince();
    setStreetAddress(listAddress?.address);
    setZipCode(listAddress?.zipcode);
    setSelectedProvinceName(listAddress?.province);
    setSelectedCityName(listAddress?.city);
  }, [listAddress]);

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (
      streetAddress === "" ||
      selectedProvinceId === null ||
      selectedCityId === null ||
      zipCode === ""
    ) {
      setError(false);
      setToast(true);
      setMessage("Please fill all field");
      return;
    }
    setError(false);
    setLoading(true);
    await axiosPut(
      `/address/${listAddress?._id}/updateAddress`,
      {
        address: streetAddress,
        city: selectedCityName,
        province: selectedProvinceName,
        zipcode: zipCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLoading(false);
    setToast(true);
    setMessage("Update address success");
    setRefreshProfile(true);
    setOpen(false);
  };

  const handleDeleteAddress = async (e) => {
    e.preventDefault();
    if (Boolean(listAddress?.isPrimary)) {
      setError(true);
      setToast(true);
      setMessage("You can't delete primary address");
      return;
    }
    setError(false)
    setLoading(true);
    await axiosDelete(`/address/${listAddress?._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setLoading(false);
    setToast(true);
    setMessage("Delete address success");
    setRefreshProfile(true);
    setOpen(false);
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
            <div className="hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
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
                    <div className="w-full bg-white overflow-hidden sm:rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Address Information
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Personal details and address.
                        </p>
                        <button
                          onClick={(e) => handleDeleteAddress(e)}
                          className="mt-3 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                          type="button"
                          data-modal-toggle="popup-modal"
                        >
                          Delete Address
                        </button>
                      </div>
                      <div className="border-t border-gray-200">
                        <dl>
                          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="mt-2 text-sm font-medium text-gray-500">
                              Street Address
                            </dt>
                            <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <textarea
                                type="text"
                                rows={1}
                                value={streetAddress}
                                onChange={(e) =>
                                  setStreetAddress(e.target.value)
                                }
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </dd>
                          </div>
                          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="mt-2 text-sm font-medium text-gray-500">
                              Country
                            </dt>
                            <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <select className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option>Indonesia</option>
                              </select>
                            </dd>
                          </div>
                          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="mt-2 text-sm font-medium text-gray-500">
                              State / Province
                            </dt>
                            <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <select
                                defaultValue={listAddress.province}
                                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                onChange={(event) =>
                                  onChangeProvince(event.target.value)
                                }
                              >
                                <option
                                  selected
                                  value={
                                    listProvince.filter((item) => {
                                      return item.nama === listAddress.province;
                                    })[0]?.id
                                  }
                                  className="text-bold text-red-500 focus:text-red-800"
                                >
                                  {listAddress.province} {"(Default Province)"}
                                </option>
                                {listProvince.map((province) => (
                                  <option key={province.id} value={province.id}>
                                    {province.nama}
                                  </option>
                                ))}
                              </select>
                            </dd>
                          </div>
                          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="mt-2 text-sm font-medium text-gray-500">
                              City
                            </dt>
                            <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <select
                                id="city"
                                name="city"
                                className={classNames(
                                  "block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                )}
                                onChange={(event) =>
                                  onChangeCity(event.target.value)
                                }
                                defaultValue={selectedCityName || ""}
                              >
                                <option
                                  selected
                                  value={
                                    listCity.filter((item) => {
                                      return item.nama === listAddress.city;
                                    })[0]?.id
                                  }
                                  className="text-bold text-red-500 focus:text-red-800"
                                >
                                  {listAddress.city} {"(Default City)"}
                                </option>
                                {listCity.map((city) => (
                                  <option key={city.id} value={city.id}>
                                    {city.nama}
                                  </option>
                                ))}
                              </select>
                            </dd>
                          </div>
                          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="mt-2 text-sm font-medium text-gray-500">
                              Zip / Postal Code
                            </dt>
                            <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <input
                                type="text"
                                name="zipcode"
                                id="zipcode"
                                onChange={(e) => setZipCode(e.target.value)}
                                value={zipCode}
                                autoComplete="address-level2"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </dd>
                          </div>
                          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
                            <dd className="flex justify-end text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              <div className="ml-4 flex-shrink-0">
                                <button
                                  onClick={() => setOpen(false)}
                                  type="button"
                                  className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-grey-600 hover:bg-grey-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Close
                                </button>
                                <button
                                  onClick={handleUpdateAddress}
                                  className="cursor-pointer inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                  Update
                                </button>
                              </div>
                            </dd>
                          </div>
                        </dl>
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
