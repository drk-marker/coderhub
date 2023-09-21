const service = require("../service/user.service");
const fileService = require("../service/file.service");
const { AVATAR_PATH } = require("../constants/file-path");
const fs = require("fs");
class UserController {
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body;
    // 查询数据
    const result = await service.create(user);
    // 返回数据
    ctx.body = result;
  }

  async avatarHandle(ctx, next) {
    // 1.获取某个用户的头像
    const { userId } = ctx.params;

    const avatarInfo = await fileService.getAvatarByUserId(userId);

    // 2.提供头像信息

    // 有下一行则表示展示出来而非下载,否则则进行下载
    ctx.response.set("content-type", avatarInfo.mimetype);

    // fs.createReadStream读取相关数据,并将数据以流形式返回
    // body里可以放string/buffer/stream/object||array/null
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
  }
}

module.exports = new UserController();
