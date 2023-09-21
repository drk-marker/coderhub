const service = require("../service/label.service");
class labelController {
  async create(ctx, next) {
    const { name } = ctx.request.body;
    const result = await service.create(name);
    ctx.body = result;
  }

  async list(ctx, next) {
    // 一般获取前几个标签不会全部获取
    const { limit, offset } = ctx.query;
    const result = await service.getLabels(limit, offset);
    ctx.body = result;
  }

  // 下面updateLabel和removeLabel没有完全实现要根据更具体需求去做
  async updateLabel(ctx, next) {
    const { labelId } = ctx.params;
    const { content } = ctx.request.body;
    const result = await service.UpdateLabel(content, labelId);
    ctx.body = result;
  }

  async removeLabel(ctx, next) {
    const { labelId } = ctx.params;
    const result = await service.removeLabel(labelId);
    ctx.body = result;
  }
}

module.exports = new labelController();
