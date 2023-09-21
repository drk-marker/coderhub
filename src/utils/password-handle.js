const crypto = require("crypto");
const md5password = (password) => {
  const md5 = crypto.createHash("md5");
  //   .digest拿到加密字符串，hex是16进制,digest不加参数拿到是二进制也就是buffer,16进制返回的是字符串
  const result = md5.update(password).digest("hex");
  return result;
};

module.exports = md5password;
