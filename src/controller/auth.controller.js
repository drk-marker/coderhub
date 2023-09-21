const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../app/config");
class AuthController {
  async login(ctx, next) {
    const { id, name } = ctx.user;
    //jwt颁发签名 expiresIn过期时间  algorithm算法
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24,
      algorithm: "RS256",
      allowInsecureKeySizes: true,
    });

    ctx.body = {
      id,
      name,
      token,
    };
  }
  async success(ctx, next) {
    ctx.body = "授权成功";
  }
}
module.exports = new AuthController();
