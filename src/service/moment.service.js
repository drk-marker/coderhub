const connection = require("../app/database");

// 对数据库做操作的时候封装在service
class MomentService {
  async create(userId, content) {
    const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [content, userId]);
    return result;
  }

  /* 
  [{"id": 4, "user": {"id": 7, "name": "lucy"}, "content": "JS是最好的语言", "commentId": null, "createTime": "2023-09-19 15:38:33.000000"}, {"id": 5, "user": {"id": 7, "name": "lucy"}, "content": "JS是最好的语言", "commentId": null, "createTime": "2023-09-19 15:38:35.000000"}, {"id": 8, "user": {"id": 7, "name": "lucy"}, "content": "世界上没有最好的语言,平分秋色", "commentId": 4, "createTime": "2023-09-19 15:45:01.000000"}]
  */

  /* 
  LEFT JOIN comment c ON c.moment_id =m.id一直使用左连接是因为想多获取moment里动态的数据,所以用左连接最好
   'user',JSON_OBJECT('id',cu.id,'name',cu.name)注意这里的id和name不能直接用u.id,因为FROM moment m
   LEFT JOIN user u ON m.user_id = u.id是通过user表和moment表中相同用户id也就是同一人为筛选条件的,但是
   评论和发表动态的不一定是同一个人所以要加上LEFT JOIN user cu ON c.user_id=cu.id判断条件并重新重命名user
  IF(a,b,c) d 如果a为true则返回d:b  a为false 返回d:c d可以理解为字段别名,这是为了解决比如评论没有动态或标签时
  仍会返回一个对象结构的JSON数据,但其实里面字段都为NULL,所以这里通过判断直接返回NULL就好,
  有JSON_ARRAYAGG注意要GROUP BY分组,否则会报错
  为防止多次左连接带来的评论和标签内容重复的问题,comments这里选择了子查询,这样就保证了查询的独立性,建议还是把查询
  评论和标签的接口单独写
  avatar_url头像url地址
  CONCAT('http://localhost:8000/moment/images/',file.filename),CONCAT是sql中拼接的一个作用,这样会把前面http://localhost:8000/moment/images/
  和file.filename拼接起来
  */
  async getMomentById(momentId) {
    const statement = `
    SELECT 
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name,'avatarUrl',u.avatar_url) author,
        (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
          JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt,
                      'user', JSON_OBJECT('id', cu.id, 'name', cu.name,'avatarUrl',cu.avatar_url))
        ),NULL) FROM comment c LEFT JOIN user cu ON c.user_id = cu.id WHERE m.id = c.moment_id) comments,
        IF(COUNT(l.id),JSON_ARRAYAGG(
          JSON_OBJECT('id', l.id, 'name', l.name)
        ),NULL) labels,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/',file.filename)) FROM file WHERE m.id=file.moment_id) images
      FROM moment m
      LEFT JOIN user u ON m.user_id = u.id
      LEFT JOIN moment_label ml ON m.id = ml.moment_id
      LEFT JOIN label l ON ml.label_id = l.id
      WHERE m.id = ?
      GROUP BY m.id; 
    `;
    try {
      const [result] = await connection.execute(statement, [momentId]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async getMomentList(offset, size) {
    // commentCount某个动态有几个评论,labelCount某个动态有几个标签
    const statement = `
    SELECT m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id', u.id, 'name', u.name) author,
        (SELECT COUNT(*) FROM comment c WHERE c.moment_id=m.id) commentCount,
        (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id=m.id) labelCount,
        (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/',file.filename)) FROM file WHERE m.id=file.moment_id) images
        FROM moment m
      LEFT JOIN user u ON m.user_id = u.id
      LIMIT ?, ?;
    `;
    const [result] = await connection.execute(statement, [offset, size]);
    return result;
  }
  async updateMoment(content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [content, momentId]);
    return result;
  }
  async removeMoment(momentId) {
    const statement = `DELETE FROM moment WHERE id = ?;`;
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }

  async hasLabel(momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result[0] ? true : false;
  }

  async addLabel(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?,?);`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result;
  }
}

module.exports = new MomentService();
