const express = require("express");
const userRouter = require("./users");
const toyRouter = require("./toys");
const orderRouter = require("./orders");
const photoRouter = require("./photos");
const modelRouter = require("./models");
const groupRouter = require("./groups");

const router = express.Router();

router.use("/users", userRouter);
router.use("/toys", toyRouter);
router.use("/orders", orderRouter);
router.use("/photos", photoRouter);
router.use("/models", modelRouter);
router.use("/groups", groupRouter);

router.use((req, res) => {
  res.send({ success: false, code: "NOT_IMPLEMENTED" });
});
router.use((err, req, res, next) => {
  if (err.name === "CONTROLLER_EXCEPTION") {
    res.send({ success: false, code: err.exceptionCode, message: err.message });
  } else {
    console.error(err);
    res.send({ success: false, code: "INTERNAL_ERROR" });
  }
});

module.exports = router;