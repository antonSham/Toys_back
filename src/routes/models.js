const express = require("express")
const router = express.Router()

const { wrap } = require("async-middleware");
const modelsController = require("../controllers/models");
const auth = require("./middelwares/auth");

router.post(
  "/create",
  wrap(async (req, res) => {
    let model = req.file;
    console.log(model)

    if (!model) return res.send("Ошибка при загрузке файла");
    const { modelId } = await modelsController.createModel({
      model_path: `http://localhost:8080/${model.path}`
    });

    res.send({ success: true, message: "Файл загружен", id: modelId });
  })
);

router.post(
  "/update",
  auth("user"),
  wrap(async (req, res) => {
    let model = req.file;

    await modelsController.updateModel({
      modelId: req.params.id,
      model_path: model.path
    });

    res.send({ success: true });
  })
);

router.post(
  "/del/:id",
  auth("admin"),
  wrap(async (req, res) => {
    const id = req.params.id;
    await modelsController.deleteModel({ modelId: id });

    res.send({
      success: true
    });
  })
);

router.get("/one/:id",
  // auth("admin"),
  wrap(async (req, res) => {
    const { id } = req.params;
    const { id: modelId, model_path } = await modelsController.getModelById({ modelId: id });

    res.send({
      success: true,
      model: { modelId, model_path }
    });
  })
)

router.get(
  "/list",
  auth("admin"),
  wrap(async (req, res) => {
    const { limit, offset } = req.params;
    const models = await modelsController.listModelById({
      limit: +limit || 10,
      offset: +offset || 0,
    });

    res.send({
      success: true,
      models,
      limit,
      offset,
    });
  })
);

module.exports = router
