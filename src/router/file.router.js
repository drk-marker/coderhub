const Router = require("koa-router");
const { verifyAuth } = require("../middleware/auth.middleware");
const {
  avatarHandle,
  pictureHandle,
  pictureResize,
} = require("../middleware/file.middleware");
const {
  saveAvatarInfo,
  savePictureInfo,
} = require("../controller/file.controller");
const fileRouter = new Router({ prefix: "/upload" });

// 上传头像文件,avatarHandle主要用来保存图片,saveAvatarInfo处理展示图片信息
fileRouter.post("/avatar", verifyAuth, avatarHandle, saveAvatarInfo);
// 上传动态里的图片
fileRouter.post(
  "/picture",
  verifyAuth,
  pictureHandle,
  pictureResize,
  savePictureInfo
);

module.exports = fileRouter;
