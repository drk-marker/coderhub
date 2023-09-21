const service = require("../service/comment.service");
class CommentController {
  async create(ctx, next) {
    const { momentId, content } = ctx.request.body;
    const { id } = ctx.user;
    const result = service.create(momentId, content, id);
    ctx.body = result;
  }
  async reply(ctx, next) {
    // momentId这次发布的评论的id,content这次发布评论的内容,commentId对哪条之前的评论进行的评论,id评论者的用户id
    const { momentId, content } = ctx.request.body;
    const { commentId } = ctx.params;
    const { id } = ctx.user;
    const result = service.reply(momentId, content, id, commentId);
    ctx.body = result;
  }

  async updateComment(ctx, next) {
    const { content } = ctx.request.body;
    const { commentId } = ctx.params;
    const result = service.updateComment(content, commentId);
    ctx.body = result;
  }
  // 注意在建表时在设置外键的时候ON DELETE CASCADE ON UPDATE CASCADE,也就是说当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话：
  // 那么关联的记录会被一起删除掉；比如id为3的评论是回复id为2的评论那么id为2的评论被删除时id为3的也会被删除
  async removeComment(ctx, next) {
    // 1.获取参数
    const { commentId } = ctx.params;
    // 2.修改内容
    const result = await service.removeComment(commentId);
    ctx.body = result;
  }

  async list(ctx, next) {
    const { momentId } = ctx.query;
    const result = await service.getCommentsByMomentId(momentId);
    ctx.body = result;
  }
}
module.exports = new CommentController();
