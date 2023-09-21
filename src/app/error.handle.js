const errorType = require("../constants/error-types");
const errorHandler = (error, ctx) => {
  let status, message;
  switch (error.message) {
    case errorType.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400; //bad request,参数有问题
      message = "用户名或密码不能为空";
      break;
    case errorType.USER_ALREADY_EXISTS:
      status = 409; //Conflict 用户名已经注册过了
      message = "用户名已经存在";
      break;
    case errorType.USER_DOES_NOT_EXISTS:
      status = 400; //用户不存在
      message = "用户不存在";
      break;
    case errorType.PASSWORD_IS_INCORRENT:
      status = 400; //密码错误
      message = "密码错误";
      break;
    case errorType.UNAUTHORIZATION:
      status = 401; //用户未授权
      message = "无效token";
      break;
    case errorType.UNPREMISSION:
      status = 401; //用户在修改别人内容,造成的未授权操作
      message = "用户没有操作权限";
      break;

    default:
      status = 404;
      message = "NOT FOUND";
  }
  ctx.status = status;
  ctx.body = message;
};
module.exports = errorHandler;
