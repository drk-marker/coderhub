const Router = require("koa-router");
const {
  verifyAuth,
  verifyPremission,
} = require("../middleware/auth.middleware");
const {
  create,
  reply,
  updateComment,
  removeComment,
  list,
} = require("../controller/comment.controller");
const commentRouter = new Router({ prefix: "/comment" });
// 对动态(moment)进行评论
commentRouter.post("/", verifyAuth, create);
// 对评论(comment)进行回复
commentRouter.post("/:commentId/reply", verifyAuth, reply);
// 修改评论
commentRouter.patch("/:commentId", verifyAuth, verifyPremission, updateComment);
// 删除评论
commentRouter.delete(
  "/:commentId",
  verifyAuth,
  verifyPremission,
  removeComment
);
// 获取评论列表(1.直接单独写一个接口,2.写在获取某条具体动态时通过sql语句查找 第2方法不推荐因为sql语句较为复杂,其次包含在某条动态中内容过多,请求会较为缓慢)
commentRouter.get("/", list);

module.exports = commentRouter;
