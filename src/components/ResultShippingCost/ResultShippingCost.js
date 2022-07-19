import React, { useEffect, useState } from "react";
import "./resultshippingcost.css";
import Button from "@mui/material/Button";
import axios from "axios";
import Toast from "../../custom/Toast/Toast";
import Loading from "../../custom/Loading/Loading";
const ResultShippingCost = ({
  cost,
  courier,
  code,
  origin,
  destination,
  weight,
  setPriceShipping,
  setChooseShipping,
}) => {
  const [IDR, setIDR] = useState()
  useEffect(() => {
    const getCurrency = async () => {
      const res = await axios.get('https://openexchangerates.org/api/latest.json?app_id=e0e9bf8de43d4dc5ad938761d4cd928b')
      setIDR(res.data.rates.IDR)
    }
    getCurrency()
  },[])

  // const [priceShipping, setPriceShipping] = useState();
  // const [chooseShipping, setChooseShipping] = useState([]);
  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [buttonChoose, setButtonChoose] = useState();

  const handleChoose = async (e, id, service) => {
    e.preventDefault();
    if (service === buttonChoose) {
      setChooseShipping([]);
      setButtonChoose("");
      return;
    }

    setLoading(true);
    const res = await axios.post(`/rajaongkir/ongkir/${id}`, {
      origin: origin,
      destination: destination,
      weight: weight,
      courier: code,
    });
    setLoading(false);
    setToast(true);
    setMessage("Success choose shipping price");
    setChooseShipping(res.data);
    setButtonChoose(res.data.service);
  };
  // console.log(chooseShipping)

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12 mb-4">
            <div className="row resultContainer headResult">
              <div className="col-md-12 d-flex">
                <div className="headResultWrapper">
                  <div className="headResultDetail">
                    <span className="courier">Courier</span>
                  </div>
                </div>
                <div className="headResultWrapper">
                  <div className="headResultDetail">
                    <span className="courier">Service</span>
                  </div>
                </div>
                <div className="headResultWrapper">
                  <div className="headResultDetail">
                    <span className="courier">Price</span>
                  </div>
                </div>
                <div className="headResultWrapper">
                  <div className="headResultDetail">
                    <span className="courier">Estimate</span>
                  </div>
                </div>
                <div className="headResultWrapper">
                  <div className="headResultDetail">
                    <span className="courier">Action</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {cost.map((costs, i) => (
            <div className="col-md-12 mb-2" key={costs.service}>
              <div className="row resultContainer">
                <div className="col-md-12 d-flex">
                  <div className="resultWrapper">
                    <div className="resultDetail">
                      <span className="courier">{code.toUpperCase()}</span>
                      <p className="courierName">{courier}</p>
                    </div>
                  </div>
                  <div className="resultWrapper">
                    <div className="resultDetail">
                      <span className="courierService">{costs.service}</span>
                      <p className="courierName">{costs.description}</p>
                    </div>
                  </div>
                  <div className="resultWrapper">
                    <div className="resultDetail">
                      <span className="priceShipping">
                        ${(costs.cost[0].value / IDR).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="resultWrapper">
                    <div className="resultDetail">
                      <span className="price">
                        {parseInt(costs.cost[0].etd)}d
                      </span>
                    </div>
                  </div>
                  <div className="resultWrapper">
                    <div className="resultDetail">
                      <Button
                        variant="contained"
                        color={
                          costs.service === buttonChoose ? "error" : "secondary"
                        }
                        size="small"
                        style={{
                          maxWidth: "100px",
                          maxHeight: "30px",
                          minWidth: "100px",
                          minHeight: "30px",
                        }}
                        onClick={(e) => {
                          handleChoose(e, i + 1, costs.service);
                          costs.service === buttonChoose
                            ? setPriceShipping(0)
                            : setPriceShipping(
                                (costs.cost[0].value / IDR).toFixed(2)
                              );
                        }}
                      >
                        {costs.service === buttonChoose ? "Choosing" : "Choose"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
