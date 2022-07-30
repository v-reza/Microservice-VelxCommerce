const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const verifyBearerToken = require("./config/verifyBearerToken");

/* Model */
const User = require("./models/User");

/* Route */
const rajaOngkirRoute = require("./router/rajaOngkir");
const productRoute = require("./router/product");
const authRoute = require("./router/auth");
const userRoute = require("./router/users");
const transactionRoute = require("./router/transaction");
const salesRoute = require("./router/sales");
const conversationsRoute = require("./router/conversations");
const messagesRoute = require("./router/messages");
const addressRoute = require("./router/address");

dotenv.config();

/**
 * Connect MongoDB
 */
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("connect mongodb bos"))
  .catch((err) => console.log(err));

/**
 * Upload File
 */
app.use(
  cors({
    origin: "*",
  })
);
app.use("/images", express.static(path.join(__dirname, "public/assets")));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/assets");
  },
  filename: (req, file, callback) => {
    const fileType = file.mimetype.split("/")[1];
    callback(null, file.originalname +"."+ fileType);
  },
});
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File upload success");
  } catch (error) {
    res.status(500).json(error);
  }
});
app.post(
  "/upload-images",
  upload.array("imgCollection", 6),
  (req, res, next) => {
    const reqFiles = [];
    const fileName = [];
    const url = req.protocol + "://" + req.get("host");
    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(url + "/public/" + req.files[i].filename);
      fileName.push(req.files[i].filename);
    }
    res.status(200).json("upload success");
  }
);

/**
 * End Upload File
 */

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/rajaongkir", rajaOngkirRoute);
app.use("/api/product", productRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/sales", salesRoute);
app.use("/api/conversations", conversationsRoute);
app.use("/api/messages", messagesRoute);
app.use("/api/address", addressRoute);
app.get("/api/storeToken", verifyBearerToken, (req, res) => {
  res.status(200).json(req.user);
});
app.get("/store/allUser", async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(process.env.PORT || 3300, () => {
  console.log("running");
});
