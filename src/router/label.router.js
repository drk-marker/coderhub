const Router = require("koa-router");
const {
  verifyAuth,
  verifyPremission,
} = require("../middleware/auth.middleware");
const {
  create,
  list,
  updateLabel,
  removeLabel,
} = require("../controller/label.controller");
const labelRouter = new Router({ prefix: "/label" });

labelRouter.post("/", verifyAuth, create);
// 展示标签
labelRouter.get("/", list);
labelRouter.patch("/:labelId", verifyAuth, verifyPremission, updateLabel);
labelRouter.delete("/:labelId", verifyAuth, verifyPremission, removeLabel);
module.exports = labelRouter;
