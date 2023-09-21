const service = require("../service/file.service");
const userService = require("../service/user.service");
const { APP_HOST, APP_PORT } = require("../app/config");

const { AVATAR_PATH } = require("../constants/file-path");
class FileController {
  async saveAvatarInfo(ctx, next) {
    // 1.获取图像相关信息
    const { filename, mimetype, size } = ctx.req.file;
    const { id } = ctx.user;
    // 2.将图像数据信息保存到数据库
    await service.createAvatar(filename, mimetype, size, id);

    // 3.将图片地址保存在user表avatar_url字段中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    await userService.updateAvatarUrlById(avatarUrl, id);

    ctx.body = "上传头像成功";
  }

  async savePictureInfo(ctx, next) {
    // 1.获取图像信息
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { moment_id } = ctx.query;
    // 2.将所有文件信息保存到数据库
    for (let file of files) {
      const { filename, mimetype, size } = file;
      await service.createFile(filename, mimetype, size, id, moment_id);
    }
    ctx.body = "上传动态配图成功";
  }
}

module.exports = new FileController();
