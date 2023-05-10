const toysController = require("../controllers/toys");
const express = require("express")
const router = express.Router()
const { sign: signToken } = require("../utils/token");
const { wrap } = require("async-middleware");
const auth = require("./middelwares/auth");


router.post(
  "/create",
  auth("admin"),
  wrap(async (req, res) => {
    const { name, price, description, firm, producing_country, photo_id, model_id, group_id } = req.body;
    const { toyId } = await toysController.createToy({
      name,
      price,
      description,
      firm,
      producing_country,
      photo_id,
      model_id,
      group_id
    });
    res.send({
      success: true,
      toyId,
      message: 'Товар был успешно создан'
    });
  })
);

router.post(
  "/update/:id",
  auth("admin"),
  wrap(async (req, res) => {
    const { name, price, description, firm, producing_country, photo_id, model_id, group_id } = req.body;
    await toysController.updateToy({
      toyId: req.params.id,
      name,
      price,
      description,
      firm,
      producing_country,
      photo_id,
      model_id,
      group_id
    });

    res.send({
      success: true,
      message: "Данные товара были изменены"
    });
  })
);

router.post(
  "/del",
  auth("admin"),
  wrap(async (req, res) => {
    const { toyId } = req.body;
    await toysController.deleteToy({ toyId });

    res.send({
      success: true,
      message: 'Товар был успешно удалён'
    });
  })
);

router.get(
  "/one/:id",
  // auth("user"),
  wrap(async (req, res) => {
    const { id: toyId } = req.params;
    const { id, name, price, description, firm, producing_country, photo_id, model_id, group_id } = await toysController.getToyById({ toyId });

    res.send({
      success: true,
      toy: { id, name, price, description, firm, producing_country, photo_id, model_id, group_id },
    });
  })
);

router.get(
  "/havingId",
  // auth("admin"),
  wrap(async (req, res) => {
    const { toyList } = req.query;
    const toys = await toysController.getToyHavingId({ toyId: toyList.split(',') });
    res.send({ success: true, toys });
  })
);

router.get(
  "/list",
  // auth("admin"),
  wrap(async (req, res) => {
    const { limit, offset } = req.params;
    const toys = await toysController.getToysList({
      limit: +limit || 10,
      offset: +offset || 0,
    });

    res.send({
      success: true,
      toys,
      limit,
      offset,
    });
  })
);

module.exports = router;
