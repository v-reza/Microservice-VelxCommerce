import { Button, Grid } from "@mui/material";
import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { AuthContext } from "../../context/UserContext";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import RefreshIcon from "@mui/icons-material/Refresh";
import Typography from "@mui/material/Typography";
import "./history.css";
import Toast from "../../custom/Toast/Toast";
import Loading from "../../custom/Loading/Loading";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const History = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
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
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [transaction, setTransaction] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { user } = useContext(AuthContext);
  const [isToast, setToast] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  //payment-type
  const [qrCodeGopay, setQrCodeGopay] = useState("");
  const [virtualBankTransfer, setVirtualBankTransfer] = useState(null);
  const [merchantCstore, setMerchantCstore] = useState(null);

  const handleOpen = async (e, transactionId, paymentType, orderId) => {
    e.preventDefault();
    destructPaymentType();
    if (paymentType === "gopay" || paymentType === "qris") {
      setQrCodeGopay(
        `https://api.sandbox.midtrans.com/v2/${paymentType}/${transactionId}/qr-code`
      );
      setOpen(true);
      return;
    } else if (paymentType === "bank_transfer") {
      const res = await axios.get(`/transaction/server/${orderId}`);
      setVirtualBankTransfer({
        bank: res.data.va_numbers[0].bank,
        va_number: res.data.va_numbers[0].va_number,
      });
      setOpen(true);
    } else if (paymentType === "cstore") {
      const res = await axios.get(`/transaction/server/${orderId}`);
      setMerchantCstore({
        store: res.data.store,
        payment_code: res.data.payment_code,
      });
      setOpen(true);
    }
  };

  const destructPaymentType = () => {
    setQrCodeGopay(false);
    setVirtualBankTransfer(null);
    setMerchantCstore(null);
  };

  const handlePaid = async (e, orderId) => {
    e.preventDefault();
    setOpen(false);
    setLoading(true);

    const res = await axios.get(`/transaction/${orderId}`);
    if (res.data.status === 404) {
      setRefresh(true);
      setLoading(false);
      setToast(true);
      setError(true);
      setMessage(res.data.message);
      return;
    }
    if (res.data.transactionStatus === "pending") {
      setRefresh(true);
      setLoading(false);
      setToast(true);
      setError(true);
      setMessage("You haven't paid this order");
      return;
    }
    setRefresh(true);
    setLoading(false);
    setToast(true);
    setError(false);
    setMessage("Success paid this order");
  };
  useEffect(() => {
    const getTransaction = async () => {
      setLoading(true);
      const res = await axios.post("/transaction/user/history", {
        userId: user._id,
      });
      setLoading(false);
      setTransaction(res.data);
    };
    getTransaction();
    setRefresh(false);
  }, [refresh, user._id]);

  const contentTransactionStatus = (status) => {
    const theme = createTheme({
      palette: {
        primary: {
          // Purple and green play nicely together.
          main: "#90caf9",
        },
        secondary: {
          // This is green.A700 as hex.
          main: "#11cb5f",
        },
        warning: {
          main: "#f57c00",
        },
        text: {
          neutral: {
            main: "#64748B",
            contrastText: "#fff",
          },
        },
      },
    });
    if (status === "pending") {
      return (
        <ThemeProvider theme={theme}>
          <Typography color="primary">
            {capitalizeFirstLetter(status)}
          </Typography>
        </ThemeProvider>
      );
    } else if (status === "settlement") {
      return (
        <ThemeProvider theme={theme}>
          <Typography color="secondary">
            {capitalizeFirstLetter(status)}
          </Typography>
        </ThemeProvider>
      );
    } else if (status === "deny") {
      return (
        <ThemeProvider theme={theme}>
          <Typography style={{ color: "#E57373" }}>
            {capitalizeFirstLetter(status)}
          </Typography>
        </ThemeProvider>
      );
    } else if (status === "expire") {
        return (
          <ThemeProvider theme={theme}>
            <Typography style={{ color: "#F44336" }}>
              {capitalizeFirstLetter(status)}
            </Typography>
          </ThemeProvider>
        );
    } else if (status === "failure") {
        return (
          <ThemeProvider theme={theme}>
            <Typography color="error">
              {capitalizeFirstLetter(status)}
            </Typography>
          </ThemeProvider>
        );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <Button
          variant="contained"
          color="secondary"
          size="small"
          style={{
            maxWidth: "280px",
            maxHeight: "30px",
            minWidth: "280px",
            minHeight: "30px",
          }}
          onClick={() => setRefresh(true)}
        >
          <RefreshIcon /> Refresh Transaction
        </Button>
        <table className="table mt-3">
          <thead>
            <tr>
              <th scope="col">Order Id</th>
              <th scope="col">Payment Type</th>
              <th scope="col">Gross Amount</th>
              <th scope="col">Transaction Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {transaction && transaction.length > 0 ? (
              transaction.map((t) => (
                <tr key={t._id}>
                  <th scope="row">{t.order_id}</th>
                  <td>{t.payment_type}</td>
                  <td>${(t.gross_amount / IDR).toFixed(2)}</td>
                  <td>{contentTransactionStatus(t.transaction_status)}</td>
                  <td>
                    {t.transaction_status === "pending" && (
                      <>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          style={{
                            maxWidth: "100px",
                            maxHeight: "30px",
                            minWidth: "100px",
                            minHeight: "30px",
                          }}
                          onClick={(e) =>
                            handleOpen(
                              e,
                              t.transaction_id,
                              t.payment_type,
                              t.order_id
                            )
                          }
                        >
                          Pay
                        </Button>

                        <Modal
                          aria-labelledby="transition-modal-title"
                          aria-describedby="transition-modal-description"
                          open={open}
                          onClose={handleClose}
                          closeAfterTransition
                          BackdropComponent={Backdrop}
                          BackdropProps={{
                            timeout: 500,
                          }}
                        >
                          <Fade in={open}>
                            <Box sx={style}>
                              {/* Payment Type Gopay */}
                              {qrCodeGopay && (
                                <>
                                  <Grid
                                    container
                                    spacing={0}
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <Grid item xs={2}>
                                      <Typography
                                        id="modal-modal-description"
                                        color="primary"
                                      >
                                        Please pay for the transaction at the
                                        scan QR Code below
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                  <img
                                    className="img-thumbnail"
                                    src={qrCodeGopay}
                                    alt=""
                                  />
                                </>
                              )}

                              {/* Payment Type Bank Transfer */}
                              {virtualBankTransfer && (
                                <Grid
                                  container
                                  spacing={0}
                                  direction="column"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Grid item xs={2}>
                                    <Typography
                                      id="modal-modal-description"
                                      color="primary"
                                    >
                                      Please pay for the transaction at the
                                      virtual number below
                                    </Typography>
                                    <Typography
                                      id="modal-modal-description"
                                      mt={2}
                                    >
                                      Bank:{" "}
                                      {virtualBankTransfer.bank.toUpperCase()}
                                    </Typography>
                                    <Typography
                                      id="modal-modal-description"
                                      sx={{ mt: 2 }}
                                    >
                                      Virtual Numbers:{" "}
                                      {virtualBankTransfer.va_number}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              )}

                              {/* Payment Type CSTORE */}
                              {merchantCstore && (
                                <Grid
                                  container
                                  spacing={0}
                                  direction="column"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Grid item xs={2}>
                                    <Typography
                                      id="modal-modal-description"
                                      color="primary"
                                    >
                                      Please pay for the transaction at payment
                                      code below
                                    </Typography>
                                    <Typography
                                      id="modal-modal-description"
                                      mt={2}
                                    >
                                      Store:{" "}
                                      {merchantCstore.store.toUpperCase()}
                                    </Typography>
                                    <Typography
                                      id="modal-modal-description"
                                      sx={{ mt: 2 }}
                                    >
                                      Payment Code:{" "}
                                      {merchantCstore.payment_code}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              )}

                              <Grid
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Grid item xs={3} mt={2}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    fullWidth
                                    style={{
                                      maxWidth: "300px",
                                      maxHeight: "30px",
                                      minWidth: "300px",
                                      minHeight: "30px",
                                    }}
                                    onClick={(e) => handlePaid(e, t.order_id)}
                                  >
                                    Yes, I Already Paid
                                  </Button>
                                </Grid>
                              </Grid>
                            </Box>
                          </Fade>
                        </Modal>
                      </>
                    )}
                    &nbsp;
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "30px",
                        minWidth: "100px",
                        minHeight: "30px",
                      }}
                    >
                      Detail
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <span>No Transaction Found</span>
            )}
          </tbody>
        </table>
      </div>
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

export default History;
