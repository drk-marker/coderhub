const Router = require("koa-router");
const { create, avatarHandle } = require("../controller/user.controller");
const userRouter = new Router({ prefix: "/users" });

const { verifyUser, handlePassword } = require("../middleware/user.middleware");
// 创建用户的时候使用post请求,处理逻辑放在对应的controller里
userRouter.post("/", verifyUser, handlePassword, create);
// 输入路径http://localhost:8000/users/7/avatar就可以进行测试
userRouter.get("/:userId/avatar", avatarHandle);

module.exports = userRouter;
