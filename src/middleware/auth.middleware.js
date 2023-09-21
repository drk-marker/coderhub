const jwt = require("jsonwebtoken");

const errorType = require("../constants/error-types");
const userService = require("../service/user.service");
const authService = require("../service/auth.service");
const md5password = require("../utils/password-handle");

const { PUBLIC_KEY } = require("../app/config");
const verifyLogin = async (ctx, next) => {
  //   1.获取用户名和密码
  const { name, password } = ctx.request.body;

  //   2.用户名密码是否为空
  if (!name || !password) {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error", error, ctx);
  }

  //   3.判断用户是否存在
  const result = await userService.getUserByName(name);
  const user = result[0];
  if (!user) {
    const error = new Error(errorType.USER_DOES_NOT_EXISTS);
    return ctx.app.emit("error", error, ctx);
  }

  //   4.用户密码加密后与数据库比对
  if (md5password(password) !== user.password) {
    const error = new Error(errorType.PASSWORD_IS_INCORRENT);
    return ctx.app.emit("error", error, ctx);
  }

  ctx.user = user;

  await next();
};

// 验证是否已经授权
const verifyAuth = async (ctx, next) => {
  console.log("验证授权的middleware");
  // 1.获取token
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorType.UNAUTHORIZATION);
    return ctx.app.emit("error", error, ctx);
  }
  const token = authorization.replace("Bearer ", "");
  // 2.用公钥验证token是否正确
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorType.UNAUTHORIZATION);
    ctx.app.emit("error", error, ctx);
  }
};

//验证用户是否拥有修改/删除权限
const verifyPremission = async (ctx, next) => {
  console.log("验证用户权限的middleware");

  // 1.获取参数,因为这里严格按照restful风格写的接口,所以url中会有commentId,momentId,tagId等字段
  // tableName就是去掉Id的其他内容
  const [resourseKey] = Object.keys(ctx.params);
  const tableName = resourseKey.replace("Id", "");
  const resourseId = ctx.params[resourseKey];
  const { id } = ctx.user;

  // 2.查询是否具备权限
  try {
    const premission = await authService.checkPremission(
      tableName,
      resourseId,
      id
    );
    if (!premission) throw new Error();
    await next();
  } catch (err) {
    const error = new Error(errorType.UNPREMISSION);
    return ctx.app.emit("error", error, ctx);
  }
};
module.exports = { verifyLogin, verifyAuth, verifyPremission };
