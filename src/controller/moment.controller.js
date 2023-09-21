const fs = require("fs");
const service = require("../service/moment.service");
const fileService = require("../service/file.service");
const { PICTURE_PATH } = require("../constants/file-path");

class MomentController {
  async create(ctx, next) {
    // 1.获取数据(user_id,content)
    const userId = ctx.user.id; //验证token的时候把result(包含id)放在ctx.user里了
    const content = ctx.request.body.content;

    // 2.将数据放到数据库里
    const result = await service.create(userId, content);
    ctx.body = result;
  }
  // 查询某一条数据
  async detail(ctx, next) {
    // 1.获取数据(momentId),ctx.params拿/moment/:momentId路径里的momentId参数
    const momentId = ctx.params.momentId;

    // 2.根据id查询数据
    const result = await service.getMomentById(momentId);
    ctx.body = result;
  }
  // 查询多条数据
  async list(ctx, next) {
    // 1.获取数据(offset/size),ctx.query拿?offset=..&size=..路径里的参数
    const { offset, size } = ctx.query;

    // 2.根据id查询数据
    const result = await service.getMomentList(offset, size);
    ctx.body = result;
  }
  // 修改某条数据
  async update(ctx, next) {
    // 1.获取参数
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;
    // 2.修改内容
    const result = await service.updateMoment(content, momentId);
    ctx.body = result;
  }
  // 删除
  async remove(ctx, next) {
    // 1.获取参数
    const { momentId } = ctx.params;
    // 2.修改内容
    const result = await service.removeMoment(momentId);
    ctx.body = result;
  }

  async addLabels(ctx, next) {
    // 1.获取标签和动态ID
    const { labels } = ctx;
    console.log("labels", labels);
    const { momentId } = ctx.params;

    // 2.添加所有标签
    for (let label of labels) {
      // 2.1判断是否动态已经添加过该标签
      const isExist = await service.hasLabel(momentId, label.id);
      if (!isExist) {
        await service.addLabel(momentId, label.id);
      }
    }
    ctx.body = "给动态添加了标签";
  }

  async fileInfo(ctx, next) {
    try {
      // 1.获取某个动态的配图
      let { filename } = ctx.params;

      const pictureInfo = await fileService.getPictureByMomentId(filename);

      const { type } = ctx.query;

      const types = ["small", "middle", "large"];
      // 因为设置了不同情况下图片大小可能不同,特地判断url中是否传来type,通过type取出服务器中
      // 对应大小图片用于显示,例如url为http://localhost:8000/moment/images/818223c67dc2677d3fc203ca81a3f661?type=middle
      if (types.some((item) => item === type)) {
        filename = filename + "-" + type;
      }
      // 2.提供动态配图信息

      // 有下一行则表示展示出来而非下载,否则则进行下载
      ctx.response.set("content-type", pictureInfo.mimetype);

      // fs.createReadStream读取相关数据,并将数据以流形式返回
      // body里可以放string/buffer/stream/object||array/null
      ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
    } catch (err) {
      console.log("err", err);
    }
  }
}
module.exports = new MomentController();
