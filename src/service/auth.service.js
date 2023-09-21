const connection = require("../app/database");
// 比较通用的判断用户是否有权限进行操作的一个service
class AuthService {
  // 判断是否有权修改评论,这里如果错误抛出异常但是又没有try catch则会去上层middleware verifyPremission中去找
  // 如果同样没有try catch则会到上一个调用的middleware里verifyAuth,也就会报无效token的错误
  async checkPremission(tableName, id, userId) {
    const statement = `SELECT * FROM ${tableName} WHERE id= ? AND user_id= ?;`;
    const [result] = await connection.execute(statement, [id, userId]);

    return result.length == 0 ? false : true;
  }
}

module.exports = new AuthService();
