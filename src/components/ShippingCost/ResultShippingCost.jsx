import { Skeleton } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Loading from "../../custom/Loading/Loading";
import Toast from "../../custom/Toast/Toast";
import { axiosPost } from "../../helper/axiosHelper";

const ResultShippingCost = ({
  listShipping,
  code,
  courier,
  origin,
  destination,
  weight,
  setPriceShipping,
  setChooseShipping,
}) => {
  const [IDR, setIDR] = useState();
  useEffect(() => {
    const getCurrency = async () => {
      const res = await axios.get(
        "https://openexchangerates.org/api/latest.json?app_id=e0e9bf8de43d4dc5ad938761d4cd928b"
      );
      setIDR(res.data.rates.IDR);
    };
    getCurrency();
  }, []);

  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [serviceChoose, setServiceChoose] = useState(null);

  const handleChoose = async (e, indexShipping, service) => {
    try {
      e.preventDefault();
      if (service === serviceChoose) {
        // setChooseShipping([]);
        setServiceChoose("");
        return;
      }

      setLoading(true);
      const res = await axiosPost(`/rajaongkir/ongkir/${indexShipping}`, {
        origin: origin,
        destination: destination,
        weight: weight,
        courier: code,
      });
      setLoading(false);
      setToast(true);
      setMessage("Success choose shipping price");
      setChooseShipping(res.data);
      setServiceChoose(res.data.service);
    } catch (error) {
      setLoading(true);
      setToast(true);
      setError(true);
      setMessage("Something when wrong when choose shipping");
    }
  };

  return (
    <>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {listShipping.map((list, index) => (
          <label
            key={index}
            onClick={(e) => {
              handleChoose(e, index + 1, list.service);
              list.service === serviceChoose
                ? setPriceShipping(0)
                : setPriceShipping((list.cost[0].value / IDR).toFixed(2));
            }}
            className="flex p-3 border border-gray-200 rounded-md bg-gray-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
          >
            <span>
              <input
                name="shipping"
                type="radio"
                className="h-4 w-4 mt-1"
                checked={list.service === serviceChoose}
                onChange={() => {}}
              />
            </span>
            <p className="ml-2">
              <span>{code.toUpperCase()}</span>
              <small className="block text-sm text-gray-400">
                $
                {isNaN(list.cost[0].value / IDR) ? (
                  <Skeleton variant="text" />
                ) : (
                  (list.cost[0].value / IDR).toFixed(2)
                )}{" "}
                -{" "}
                {code.toUpperCase() !== "POS"
                  ? list.cost[0].etd + " day"
                  : list.cost[0].etd.replace("HARI", "day")}
              </small>
            </p>
          </label>
        ))}
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

export default ResultShippingCost;
