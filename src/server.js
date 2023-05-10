const express = require("express");
const apiRouter = require("./routes");
require("dotenv").config();
const multer = require("multer");

const SERVER_PORT = process.env.SERVER_PORT || 8080

const app = express();
app.use(express.json())
app.use(express.static(__dirname));

const storageConfig = multer.diskStorage({
  destination: (_, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {

    cb(null, file.originalname);
  }
});
app.use(multer({ storage: storageConfig }).single("photo"));
app.use('/uploads', express.static("uploads"));


// const storageConfig = multer.diskStorage({
//   destination: (_, file, cb) => {
//     if (file.mimetype === 'model/gltf') {
//       cb(null, 'models')
//     } else if (file.mimetype === 'image/jpeg') {
//       cb(null, 'uploads')
//     } else if (file.mimetype === 'group/jsx') {
//       cb(null, 'groups')
//     } else {
//       console.log(file.mimetype)
//       cb({ error: 'Mime type not supported' })
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   }
// });
// app.use(multer({ storage: storageConfig }).single("files"));
// app.use('/uploads', express.static("uploads"));
// app.use('/models', express.static("models"));
// app.use('/groups', express.static("groups"));

// const storageModel = multer.diskStorage({
//   destination: (_, file, cb) => {
//     cb(null, "models");
//   },
//   filename: (req, file, cb) => {

//     cb(null, file.originalname);
//   }
// });
// app.use(multer({ storage: storageModel }).single("model"));
// app.use('/models', express.static("models"));


// const storageGroup = multer.diskStorage({
//   destination: (_, file, cb) => {
//     cb(null, "groups");
//   },
//   filename: (req, file, cb) => {

//     cb(null, file.originalname);
//   }
// });
// app.use(multer({ storage: storageGroup }).single("group"));
// app.use('/groups', express.static("groups"));


app.use("/api/v1", apiRouter);
app.use((_, res) => {
  res.status(404).send("Route Not Found.");
});
app.use((err, _, res, next) => {
  res.status(500).send("500. Internal server error.");
});

app.listen(SERVER_PORT, () =>
  console.log(`Server is listening on http://localhost:${SERVER_PORT}/api/v1`)
);
