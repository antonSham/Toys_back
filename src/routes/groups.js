const express = require("express")
const router = express.Router()

const { wrap } = require("async-middleware");
const groupsController = require("../controllers/groups");
const auth = require("./middelwares/auth");

router.post(
  "/create",
  wrap(async (req, res) => {
    let group = req.file;
    console.log(group)

    if (!group) return res.send("Ошибка при загрузке файла");
    const { groupId } = await groupsController.createGroup({
      group_path: `http://localhost:8080/${group.path}`
    });

    res.send({ success: true, message: "Файл загружен", id: groupId });
  })
);

router.post(
  "/update",
  auth("user"),
  wrap(async (req, res) => {
    let group = req.file;

    await groupsController.updateGroup({
      groupId: req.params.id,
      group_path: group.path
    });

    res.send({ success: true });
  })
);

router.post(
  "/del/:id",
  auth("admin"),
  wrap(async (req, res) => {
    const id = req.params.id;
    await groupsController.deleteGroup({ groupId: id });

    res.send({
      success: true
    });
  })
);

router.get("/one/:id",
  // auth("admin"),
  wrap(async (req, res) => {
    const { id } = req.params;
    const { id: groupId, group_path } = await groupsController.getGroupById({ groupId: id });

    res.send({
      success: true,
      group: { groupId, group_path }
    });
  })
)

router.get(
  "/list",
  auth("admin"),
  wrap(async (req, res) => {
    const { limit, offset } = req.params;
    const groups = await groupsController.listGroupById({
      limit: +limit || 10,
      offset: +offset || 0,
    });

    res.send({
      success: true,
      groups,
      limit,
      offset,
    });
  })
);

module.exports = router
