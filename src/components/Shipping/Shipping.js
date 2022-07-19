import React, { useCallback, useState } from "react";
import "./shipping.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import axios from "axios";
import Toast from "../../custom/Toast/Toast";
import Loading from "../../custom/Loading/Loading";
import ResultShippingCost from "../ResultShippingCost/ResultShippingCost";

const Shipping = ({ city, setPriceShipping, setChooseShipping }) => {
  const [cityFrom, setCityFrom] = useState(null);
  const [cityTo, setCityTo] = useState(null);
  const [courier, setCourier] = useState(null);
  const [cost, setCost] = useState([]);
  const [courierCode, setCourierCode] = useState(null);
  const [courierName, setCourierName] = useState(null);
  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const courierList = [
    { courier: "JNE" },
    { courier: "POS" },
    { courier: "TIKI" },
  ];

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
      const res = await axios.post("/rajaongkir/ongkir", {
        origin: origin,
        destination: destination,
        weight: weight,
        courier: optionCourier.toLowerCase(),
      });
      setLoading(false);
      setToast(true);
      setMessage("Success checking shipping cost");
      setCost(res.data.rajaongkir.results[0].costs);
      setCourierCode(res.data.rajaongkir.results[0].code);
      setCourierName(res.data.rajaongkir.results[0].name);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 mb-4">
          <div className="row shippingContainer">
            <div className="col-md-12 d-flex">
              <div className="cityWrapper">
                <div className="cityDetail">
                  <div className="col-md-3">
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
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Courier" />
                      )}
                    />
                  </div>
                  <div className="col-md-3">
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
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="City from" />
                      )}
                    />
                  </div>
                  <div className="col-md-3">
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
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="City To" />
                      )}
                    />
                  </div>
                  <div className="col-md-4">
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={(e) => priceShipping(e)}
                    >
                      Check Shipping Price
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {cost && cost.length > 0 ? (
        <ResultShippingCost
          cost={cost}
          code={courierCode}
          courier={courierName}
          origin={cityFrom?.city_id}
          destination={cityTo?.city_id}
          weight={100}
          setPriceShipping={setPriceShipping}
          setChooseShipping={setChooseShipping}
        />
      ) : (
        <div></div>
      )}
      {/* <ResultShippingCost/> */}
      <Toast
        open={isToast}
        setOpen={setToast}
        message={message}
        variant={error ? "error" : "success"}
      />
      <Loading open={loading} setOpen={setLoading} />
    </div>
  );
};

export default Shipping;
