const fs = require("fs");
const useRoutes = function () {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === "index.js") {
      return;
    } else {
      const router = require(`./${file}`);
      this.use(router.routes());
      // 判断使用的请求方式支不支持
      this.use(router.allowedMethods());
    }
  });
};
module.exports = useRoutes;
