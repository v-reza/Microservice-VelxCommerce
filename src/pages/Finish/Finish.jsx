/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { axiosGet } from "../../helper/axiosHelper";

const Finish = () => {
  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  };

  const [progress, setProgress] = useState(10);
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10
      );
      //   window.location.href = "/";
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  //   if (progress === 100) {
  //     window.location.href = "/";
  //   }

  const [queryString] = useSearchParams();
  const id = queryString.get("id");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [transactionId, setTransactionId] = useState(null);
  useEffect(() => {
    const getTransaction = async () => {
      try {
        const res = await axiosGet(`/transaction/${id}`);
        setTransactionStatus(res.data.transactionStatus);
        setTransactionId(res.data.transactionId);
      } catch (error) {
        navigate("/404")
      }
    };
    getTransaction();
  }, [id, navigate]);

  if (progress === 100) {
    window.location.href = "/transaction"
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12" align="center">
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={progress} />
            <span>
              You will be redirect to transaction history in 10 seconds
            </span>
          </Box>
        </div>
      </div>
      <br/>
      <div className="row">
        <div className="col-md-12" align="center">
          Your Transaction Id {id} is {transactionStatus}
        </div>
      </div>
    </div>
  );
};

export default Finish;
