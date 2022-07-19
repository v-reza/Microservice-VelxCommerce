/**
 * Route Transaction + Midtrans Integration
 */
const router = require("express").Router();
const midtransClient = require("midtrans-client");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Sales = require("../models/Sales");
const Transaction = require("../models/Transaction");
const axios = require("axios");
const dotenv = require("dotenv");
const sha512 = require("js-sha512").sha512;
dotenv.config();

//config midtrans
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SECRET_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

//buat snap token midtrans and send to client side(frontend)
//buat transcation detail and send to midtrans server
router.post("/", async (req, res) => {
  try {
    const { userId, tax } = req.body;
    const items = [];
    const amountPrice = [];
    const currency = await axios.get(process.env.CURRENCY_URL);
    const IDR = currency.data.rates.IDR;
    const cart = await axios.get(
      `http://localhost:3300/api/users/cart/${userId}`
    );
    await cart.data.map((res) => {
      items.push({
        id: res._id,
        price: parseInt(parseInt(res.cart[0].product_price) * IDR),
        quantity: parseInt(res.qty),
        name: res.cart[0].product_name,
      });
    });
    items.map((i) =>
      amountPrice.push(parseInt(i.price) * parseInt(i.quantity))
    );
    items.push({
      id: `Tax-${Math.random().toString(16).slice(2)}`,
      quantity: 1,
      price: parseInt(parseFloat(tax) * IDR),
      name: "Tax",
    });
    amountPrice.push(parseInt(parseFloat(tax) * IDR));

    const grossAmount = amountPrice.reduce((a, b) => a + b, 0);

    const parameter = {
      transaction_details: {
        order_id: Math.random().toString(16).slice(2),
        gross_amount: grossAmount,
      },
      credit_card: {
        secure: true,
      },
      item_details: items,
      customer_details: {
        first_name: "Reza",
        last_name: "Midtrans",
        email: "mrezalf0@gmail.com",
        phone: "08111222333",
      },
      callbacks: {
        finish: "http://localhost:3000/checkout/finish",
        cancel: "http://localhost:3000/checkout/cancel",
        pending: "http://localhost:3000/checkout/pending",
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.status(200).json({
      snapToken: transaction.token,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// buat callback dari client side yang mengirimkan data transcation dari midtrans server,
// dan buat transaction ke local database
router.post("/callback", async (req, res) => {
  const { userId, result } = req.body;

  try {
    const cart = await axios.get(
      `http://localhost:3300/api/users/cart/${userId}`
    );
    let rawCartId = [];
    await cart.data.map((c) => rawCartId.push({ cartId: c._id }));

    const newTransaction = await Transaction.create({
      user_id: userId,
      status_message: result.status_message,
      status_code: result.status_code,
      transaction_id: result.transaction_id,
      order_id: result.order_id,
      gross_amount: result.gross_amount,
      payment_type: result.payment_type,
      transaction_status: result.transaction_status,
      transaction_time: result.transaction_time,
      currency: "IDR",
      fraud_status: result?.fraud_status ? result.fraud_status : "accept",
      pdf_url: result?.pdf_url ? result.pdf_url : "none",
    });
    const getNewTransaction = await Transaction.findById(newTransaction._id);

    rawCartId.map(
      async (raw) =>
        await getNewTransaction.updateOne({ $push: { cart_id: raw.cartId } })
    );

    //update signature key
    const signatureKey = sha512(
      newTransaction.order_id +
        newTransaction.status_code +
        newTransaction.gross_amount +
        process.env.MIDTRANS_SERVER_KEY
    );
    await getNewTransaction.updateOne({
      $set: { signature_key: signatureKey },
    });

    const updateCart = await Cart.updateMany(
      { userId: userId, status_transaction: false },
      { $set: { status_transaction: true } }
    );

    console.log(getNewTransaction);
    console.log("cart: " + JSON.stringify(rawCartId));
    console.log("stringify => " + JSON.stringify(newTransaction));
    return res.status(200).json(newTransaction);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//cek transaction by orderId, dan cek transaction status dari local ke midtrans server,
//jika transaction status dari local database tidak sesuai dengan midtrans server,
//maka otomatis update transaction status di local db sesuai dengan midtrans server
router.get("/:orderId", async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      order_id: req.params.orderId,
    });
    if (!transaction) {
      return res.status(404).json({
        status: 404,
        message: "No Transaction Found",
      });
    }

    const callbackMidtrans = await axios.get(
      `https://api.sandbox.midtrans.com/v2/${transaction.order_id}/status`,
      {
        headers: {
          Authorization: process.env.BASE64_SERVER_KEY,
        },
      }
    );

    const transactionMidtrans = await callbackMidtrans.data.transaction_status;

    if (transaction.transaction_status !== transactionMidtrans) {
      await transaction.updateOne({
        $set: { transaction_status: transactionMidtrans },
      });
    }

    const getNewTransaction = await Transaction.findOne({
      order_id: req.params.orderId,
    });

    const sales = await Sales.findOne({
      transactionId: getNewTransaction._id,
    });
    await sales.updateOne({
      $set: {
        transaction_status: getNewTransaction.transaction_status,
      },
    });

    return res.status(200).json({
      orderId: callbackMidtrans.data.order_id,
      transactionStatus: transactionMidtrans,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
});

//cek semua transaction di local db, dan cek transaction status dari local ke midtrans server,
//jika transaction status dari local database tidak sesuai dengan midtrans server,
//maka otomatis update transaction status di local db sesuai dengan midtrans server
router.post("/user/history", async (req, res) => {
  const { userId } = req.body;
  try {
    const transaction = await Transaction.find({ user_id: userId });

    let orderId = [];
    transaction.map((t) => {
      orderId.push({ orderId: t.order_id, status: t.transaction_status });
    });

    orderId.map(async (id) => {
      const callbackMidtrans = await axios.get(
        `https://api.sandbox.midtrans.com/v2/${id.orderId}/status`,
        {
          headers: {
            Authorization: process.env.BASE64_SERVER_KEY,
          },
        }
      );
      const newTransaction = await Transaction.findOne({
        order_id: id.orderId,
      });
      if (id.status !== callbackMidtrans.data.transaction_status) {
        await newTransaction.updateOne({
          $set: {
            transaction_status: callbackMidtrans.data.transaction_status,
          },
        });
      }
      const sales = await Sales.findOne({
        transactionId: newTransaction._id,
      });
      console.log(sales);
      await sales.updateOne({
        $set: { transaction_status: newTransaction.transaction_status },
      });
    });

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get order data from midtrans
router.get("/server/:orderId", async (req, res) => {
  try {
    const callbackMidtrans = await axios.get(
      `https://api.sandbox.midtrans.com/v2/${req.params.orderId}/status`,
      {
        headers: {
          Authorization: process.env.BASE64_SERVER_KEY,
        },
      }
    );
    return res.status(200).json(callbackMidtrans.data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
