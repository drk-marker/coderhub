// 某刻发表动态
const Router = require("koa-router");
const momentRouter = new Router({ prefix: "/moment" });
const {
  verifyAuth,
  verifyPremission,
} = require("../middleware/auth.middleware");
const { verifyLabelExists } = require("../middleware/label.middleware");
const {
  create,
  detail,
  list,
  update,
  remove,
  addLabels,
  fileInfo,
} = require("../controller/moment.controller");
// 创建动态
momentRouter.post("/", verifyAuth, create);
// 获取多条动态详情
momentRouter.get("/", list);
// 获取某一条动态详情
momentRouter.get("/:momentId", detail);
// 修改某条动态数据,一个要鉴权是否登录,还有一个就是要验证登录的用户是否有权去修改内容
momentRouter.patch("/:momentId", verifyAuth, verifyPremission, update);
momentRouter.delete("/:momentId", verifyAuth, verifyPremission, remove);

// 给动态添加标签
momentRouter.post(
  "/:momentId/labels",
  verifyAuth,
  verifyPremission,
  verifyLabelExists,
  addLabels
);

// 动态配图的服务(配置完后输入url(http://localhost:8000/moment/images/cd5fedd1a00e49cba257d78a86489d4d)可以访问图片)
momentRouter.get("/images/:filename", fileInfo);
module.exports = momentRouter;
