import { Card, Grid, styled, useTheme } from "@mui/material";
import { Fragment } from "react";
import Campaigns from "./shared/Campaigns";
import DoughnutChart from "./shared/Doughnut";
import RowCards from "./shared/RowCards";
import StatCards from "./shared/StatCards";
import StatCards2 from "./shared/StatCards2";
import TopSellingTable from "./shared/TopSellingTable";
import UpgradeCard from "./shared/UpgradeCard";
import { useState, useEffect } from "react";
import axios from "axios";

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginRight: ".5rem",
  textTransform: "capitalize",
}));

const SubTitle = styled("span")(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: "500",
  marginBottom: "16px",
  textTransform: "capitalize",
  color: theme.palette.text.secondary,
}));

const Analytics = () => {
  const { palette } = useTheme();
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrderQuantity, setTotalOrderQuantity] = useState(0);
  const [transactionPending, setTransactionPending] = useState(0);
  const [transactionSettlement, setTransactionSettlement] = useState(0);
  const [transactionCancel, setTransactionCancel] = useState(0);

  useEffect(() => {
    const getSales = async () => {
      const res = await axios.get("http://localhost:3300/api/sales", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("velx-token")}`,
        },
      });
      if (res.data.length > 0) {
        let arrayTotalOrderQuantity = [];
        let arrayTotalAmount = [];
        // eslint-disable-next-line array-callback-return
        res.data.map((item) => {
          arrayTotalOrderQuantity.push(item.qty);
          arrayTotalAmount.push(parseInt(item.amount));
        });
        setTransactionSettlement(
          res.data.filter((data) => data.transaction_status === "settlement")
        );
        setTransactionPending(
          res.data.filter((data) => data.transaction_status === "pending")
        );
        setTransactionCancel(
          res.data.filter((data) => data.transaction_status === "cancel")
        );
        setTotalAmount(
          arrayTotalAmount.reduce((prevVal, nextVal) => prevVal + nextVal, 0)
        );
        setTotalOrderQuantity(
          arrayTotalOrderQuantity.reduce(
            (prevVal, nextVal) => prevVal + nextVal,
            0
          )
        );
        setTotalOrder(res.data.length);
      }
    };
    getSales();
  }, []);

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <StatCards
              totalOrder={totalOrder}
              totalAmount={totalAmount}
              totalOrderQuantity={totalOrderQuantity}
            />
            <TopSellingTable />
            <StatCards2 />

            <H4>Ongoing Projects</H4>
            <RowCards />
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>Traffic Transaction</Title>
              {/* <SubTitle>Last 30 days</SubTitle> */}

              <DoughnutChart
                height="300px"
                color={[
                  palette.secondary.light,
                  palette.primary.main,
                  palette.error.main,
                ]}
                transactionSettlement={transactionSettlement.length}
                transactionPending={transactionPending.length}
                transactionCancel={transactionCancel.length}
              />
            </Card>

            <Campaigns />
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
};

export default Analytics;
