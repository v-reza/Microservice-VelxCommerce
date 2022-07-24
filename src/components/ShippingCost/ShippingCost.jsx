import { Autocomplete, Button, LinearProgress, TextField } from "@mui/material";
import React, { Suspense, useState, lazy } from "react";
import Loading from "../../custom/Loading/Loading";
import Toast from "../../custom/Toast/Toast";
import { axiosPost } from "../../helper/axiosHelper";
const ResultShippingCost = lazy(() => import("./ResultShippingCost"));

const courierList = [
  { courier: "JNE" },
  { courier: "POS" },
  { courier: "TIKI" },
];

const ShippingCost = ({ city, setPriceShipping, setChooseShipping }) => {
  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [cityFrom, setCityFrom] = useState(null);
  const [cityTo, setCityTo] = useState(null);
  const [courier, setCourier] = useState(null);

  const [listShipping, setListShipping] = useState([]);
  const [courierCode, setCourierCode] = useState(null);
  const [courierName, setCourierName] = useState(null);

  const priceShipping = async (e) => {
    e.preventDefault();
    if (!cityFrom || !cityTo || !courier) {
      setToast(true);
      setError(true);
      setMessage("Option shipping price required");
    } else {
      setError(false);
      const { courier: optionCourier } = courier;
      const { city_id: origin } = cityFrom;
      const { city_id: destination } = cityTo;
      const weight = 100;

      setLoading(true);
      const res = await axiosPost("/rajaongkir/ongkir", {
        origin: origin,
        destination: destination,
        weight: weight,
        courier: optionCourier.toLowerCase(),
      });
      setLoading(false);
      setToast(true);
      setMessage("Success checking shipping cost");
      setListShipping(res.data.rajaongkir.results[0].costs);
      setCourierCode(res.data.rajaongkir.results[0].code);
      setCourierName(res.data.rajaongkir.results[0].name);
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-5">Shipping price</h2>

      {/* radio selection */}
      <div className="grid sm:grid-cols-4 gap-3 mb-6">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={courierList}
          getOptionLabel={(courier) => courier.courier}
          isOptionEqualToValue={(courier) => courier.courier}
          onChange={(e, value) => {
            e.preventDefault();
            setCourier(value);
          }}
          renderInput={(params) => <TextField {...params} label="Courier" />}
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={city}
          getOptionLabel={(city) => city.city_name}
          isOptionEqualToValue={(city) => city.city_name}
          onChange={(e, value) => {
            e.preventDefault();
            setCityFrom(value);
          }}
          renderInput={(params) => <TextField {...params} label="Origin" />}
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={city}
          getOptionLabel={(city) => city.city_name}
          isOptionEqualToValue={(city) => city.city_name}
          onChange={(e, value) => {
            e.preventDefault();
            setCityTo(value);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Destination" />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={priceShipping}
        >
          Check Price
        </Button>
      </div>
      {listShipping && listShipping.length > 0 ? (
        <Suspense fallback={<LinearProgress />}>
          <ResultShippingCost
            listShipping={listShipping}
            code={courierCode}
            courier={courierName}
            origin={cityFrom?.city_id}
            destination={cityTo?.city_id}
            weight={100}
            setPriceShipping={setPriceShipping}
            setChooseShipping={setChooseShipping}
          />
        </Suspense>
      ) : (
        ""
      )}
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

export default ShippingCost;
