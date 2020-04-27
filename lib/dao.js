/**
 * @author    hc
 * @time      2019-10-18
 * @change    2020-04-26
 * 数据库持久层
 *    1， 提供操作数据库的方法
 *    2， 防止sql注入攻击
 *    3,  如果数据库不存在则初始化数据库
 *
 *     记得归还连接    ----------    你还欠我一个连接
 *
 *
 *     数据库备份
 *     mysqldump -h主机名 -P端口 -u用户名 -p密码 --database 数据库名 > 文件名.sql
 */

const mysql = require('mysql');
const config = require('./config');
const logger = require('./logger');
const dbs = require('./dbs.js');
const tables = dbs.config;

// 创建数据库连接
const cnnPool = mysql.createPool({
  host: config.dbHost || 'localhost',
  port: config.dbPort || '3306',
  user: config.dbUser || 'root',
  password: config.dbPasswd || '123',
  database: config.dbDatabase || 'bysj', // 优先使用数据库配置中的数据库名 而不是全局的数据库名
  connectionLimit: config.dbPool || 10,
  connectTimeout: config.dbTimeOut || 30,
  multipleStatements: config.dbMultiSQL || false,
  stringifyObjects: true, // 序列化对象
  typeCast: true, // 转换列值为本地JavaScript数据类型
});

// 防止连接池初始化完成之前获取连接， 这种做法非常hack不保险，后期考虑修改
setTimeout(() => checkCnnPool(), 300);

/**
 * 测试数据库连接池
 */
function checkCnnPool() {
  logger.info('数据库自检中...');
  const sql = 'SELECT 1 + 1 AS result;';
  myQuery(sql, (data) => {
    if (data === false) {
      logger.error('数据库连接池初始化失败');
      process.exit();
    } else {
      logger.info('数据库连接池初始化成功');
      checkDatabase();
    }
  });
  process.once('uncaughtException', processEixt);
  process.once('beforeExit', processEixt);
  process.once('exit', processEixt);
  process.once('SIGINT', processEixt);
  function processEixt() {
    logger.info(`关闭数据库`);
    cnnPool.end(); // 确保所有的查询sql语句执行完成之后再退出
    process.exit();
  }
}

/**
 * 数据库自检
 */
function checkDatabase() {
  const keys = Object.keys(dbs.items);
  const lis = [];
  keys.forEach((key) => {
    lis.push(
      new Promise((res, rej) => {
        const items = dbs.items[key];
        logger.info(`检测${items.msg}...`);
        myQuery(items.check, (data) => {
          if (data && data.length <= 0) {
            myQuery(items.init, (data) => {
              if (data) {
                logger.info(`${items.msg}不存在，已自动构建...`);
                res(data);
              } else {
                logger.fatal(`${items.msg}不存在，构建失败...`);
                rej(false);
              }
            });
          }
          res(data);
        });
      })
    );
  });
  Promise.all(lis).then((res) => {
    if (res.every((item) => item && item.length > 0)) {
      logger.info('数据库初始化完成...');
    }
  });
}

/**
 * 简单封装的查询语句，自动从连接池里获取连接，处理程序异常，完成查询之后自动放回连接池
 * @param {*} String  SQL语句
 * @param {*} callback 回调函数
 */
function myQuery(sql, callback) {
  cnnPool.getConnection((error, cnn) => {
    if (error) return callback(false);
    cnn.query(sql, (error, data, feild) => {
      if (error) {
        logger.error(error);
        callback(false);
      } else {
        callback(data);
      }
    });
    cnn.release();
  });
}

module.exports = {
  /**
   * 通过关键字模糊查询
   * @param {*} kw 关键字
   * @param {*} bg 起始位置
   * @param {*} len 结束位置
   * @param {*} callback 会掉函数
   */
  getByKeyWord(kw, bg, len, callback) {
    const sql = `SELECT  *  FROM ${tables.table_image} WHERE TAG LIKE '%${kw}%' limit ${bg},${len};`;
    myQuery(sql, callback);
  },

  /**
   * 通过关键字查询
   * @param {*} kw 关键字
   * @param {*} callback 回调函数
   */
  getCountByKeyWord(kw, callback) {
    const sql = `SELECT COUNT(*) AS total FROM ${tables.table_image} WHERE TAG LIKE '%" + kw + "%';`;
    myQuery(sql, callback);
  },

  /**
   * 从图片表中查找所有的图片分类
   * @param {*} callback
   */
  getAllImageType(callback) {
    const sql = `SELECT distinct category FROM ${tables.table_image}`;
    myQuery(sql, callback);
  },

  /**
   * 获取指定图片类型的数据
   * @param {String} category 分类信息
   * @param {number} count  便宜量
   * @param {number} len  长度
   * @param {Function} callback  回调函数
   */
  getImageByCategory(category, count, len, callback) {
    const sql = `SELECT  *  FROM ${tables.table_image} WHERE category='${category}' limit ${count},${len};`;
    myQuery(sql, callback);
  },

  /**
   * 获取指定分类图片 的数量
   * @param {String} category 分类信息
   * @param {Function} callback  回调函数
   */
  getImageLenByCategory(category, callback) {
    const sql = `SELECT COUNT(*) AS total FROM ${tables.table_image} WHERE category='${category}';`;
    myQuery(sql, callback);
  },

  /**
   * 获取必应最近7日的数据
   * @param {Function} callback
   */
  getBiyingServenDay(callback) {
    const sql = `SELECT * FROM ${tables.table_biying} ORDER BY date desc limit 0,7;`;
    myQuery(sql, callback);
  },

  /**
   * 获取最新金山词典数据
   * @param {Function} callback
   */
  getEnglishDaily(callback) {
    const sql = `SELECT * FROM ${tables.table_english} ORDER BY time DESC LIMIT 0,1;`;
    myQuery(sql, callback);
  },

  /**
   * 账户登录的用户检查
   * @param {String} count
   * @param {Strign} passwd
   * @param {Function} callback
   */
  getUserByCount(count, passwd, callback) {
    const sql = `SELECT * FROM ${tables.table_user} WHERE count='${count}' and passwd='${passwd}';`;
    myQuery(sql, callback);
  },

  /**
   * 检查指定用户名是否存在
   * @param {String} count
   * @param {Function} callback
   */
  getUserExistsByCount(count, callback) {
    const sql = `SELECT * FROM ${tables.table_user} WHERE count='${count}';`;
    myQuery(sql, callback);
  },

  /**
   * 添加用户
   * @param {String} count
   * @param {String} passwd
   * @param {Function} callback
   */
  addUserByCount(count, passwd, callback) {
    const name = 'user' + new Date().getTime();
    const sql = `INSERT INTO ${tables.table_user} (count,passwd,name) values('${count}', '${passwd}', '${name}');`;
    myQuery(sql, callback);
  },

  /**
   * 获取用户信息
   * @param {Number} id 解密token的用户id
   * @param {Function} callback
   */
  getUserInfoAll(id, callback) {
    const sql = `SELECT * FROM ${tables.table_user} WHERE id='${id}';`;
    myQuery(sql, callback);
  },

  // 废弃， 校验图片相似度
  getImageByIdentify(identify, callback) {
    const sql = `SELECT * FROM ${tables.table_image} WHERE gary64='${identify}';`;
    console.log(sql);
    myQuery(sql, callback);
  },

  /**
   * 获取用户信息
   * @param {number} count
   * @param {number} len
   * @param {Function} callback
   */
  getAllUserInfo(count, len, callback) {
    const sql = `SELECT * FROM ${tables.table_user} LIMIT ${count},${len};`;
    myQuery(sql, callback);
  },
  /**
   * 删除用户信息
   * @param {number} id
   * @param {Function} callback
   */
  deleteUserInfo(id, callback) {
    const sql = `DELETE FROM ${tables.table_user} WHERE id='${id}';`;
    myQuery(sql, callback);
  },
};
