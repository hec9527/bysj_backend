/**
 * @author    hc
 * @time      2019-10-18
 * @change    2019-10-18
 * 数据库持久层   
 *    1， 提供操作数据库的方法
 *    2， 防止sql注入攻击
 *    3,  如果数据库不存在则初始化数据库
 * 
 *     记得归还连接    ----------    你还欠我一个连接
 */



const mysql = require("mysql");
const config = require("./config");
const logger = require("./logger");

// 创建数据库连接
const cnnPool = mysql.createPool({
    host: config.dbHost || "localhost",
    port: config.dbPort || "3306",
    user: config.dbUser || "root",
    password: config.dbPasswd || "123456",
    database: config.dbDatabase || "bysj",
    connectionLimit: config.dbPool || 10,
    connectTimeout: config.dbTimeOut || 30,
    stringifyObjects: true, // 序列化对象
    typeCast: true,         // 转换列值为本地JavaScript数据类型
});

// 数据库的sql语句，用于初始化数据库或者检测数据库
// const sqls = [
//     {
//         action: "createUserTable",
//         sql: "create table if not exists `user` ( \
//                     `userID`  int(12) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户的ID，这个唯一 主键' ,\
//                     `userAccount`  varchar(20) NOT NULL COMMENT '用户的账户     唯一标志    可用于登陆验证' ,\
//                     `userName`  varchar(20) NOT NULL COMMENT '用户昵称  这个不是用来登陆用的，只是展示' ,\
//                     `userAge`  tinyint(3) NOT NULL DEFAULT 0 COMMENT '没啥用    不填也罢' ,\
//                     `userSex`  char(1) NOT NULL COMMENT '无意义  不填也罢' ,\
//                     `userAddr`  varchar(30) NULL COMMENT '用户地址   无意思不填也罢' ,\
//                     `userStatus`  varchar(80) NULL COMMENT '用户个性签名' ,\
//                     `userPasswd`  varchar(18) NOT NULL COMMENT '用户密码' ,\
//                     `userQQ`  varchar(14) NULL COMMENT '用户QQ号' ,\
//                     `userWechat`  varchar(20) NULL COMMENT '用户微信账号' ,\
//                     `userEmail`  varchar(25) NULL COMMENT '用户邮箱' ,\
//                     `userPhone`  char(13) NULL COMMENT '用户手机号码' ,\
//                     `userRank`  tinyint(3) NOT NULL DEFAULT 0 COMMENT '用户等级' ,\
//                     `userVIPRank`  tinyint(3) NOT NULL DEFAULT 0 COMMENT '用户的VIP等级' ,\
//                     `userBalance`  int(10) NOT NULL DEFAULT 0 COMMENT '用户的账户余额' ,\
//                     `userLastLogin`  time NOT NULL DEFAULT 00000000000000 COMMENT '用户最后一次登陆' ,\
//                     `userLimited`  tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户是否被禁止登陆' ,\
//                     `userBanned`  tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户账号是否被封' ,\
//                     PRIMARY KEY (`userID`, `userAccount`))\
//                     DEFAULT CHARACTER SET = utf8 COLLATE = utf8_bin; "
//     }, {
//         action: "createImagesTable",
//         sql: `
//         CREATE TABLE 'images'(
//         'id'  int(8) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键索引 ',
//         'fName'  varchar(50) NOT NULL COMMENT '文件名',
//         'fKind'  varchar(50) NOT NULL COMMENT '图片分类',
//         'fThumbnail'  varchar(50) NOT NULL COMMENT '缩略图地址',
//         'userAccount'  varchar(20) NOT NULL DEFAULT 'system' COMMENT '上传者',
//         'fWebSite'  varchar(50) NOT NULL DEFAULT '上传者' COMMENT '来源网站',
//         'fUpTime'  timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '上传时间',
//         PRIMARY KEY('id', 'fName'),
//         FOREIGN KEY('userAccount') REFERENCES'user'('userAccount') ON DELETE NO ACTION,
//         FULLTEXT INDEX('fName', 'fKind')
//         )
//         DEFAULT CHARACTER SET = utf8 COLLATE = utf8_bin;`,
//     }, {
//         action: "createImagePathTable",
//         sql: `
//             CREATE TABLE'imagesPath'(
//                 'id'  int(8) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '索引',
//                 'fName'  varchar(50) NOT NULL COMMENT '文件名',
//                 'fResolution'  varchar(5) NOT NULL COMMENT '分辨率',
//                 'fPath'  varchar(50) NOT NULL COMMENT '文件路径',
//                 'fSize'  varchar(12) NULL COMMENT '文件大小',
//                 PRIMARY KEY('id','fName'),
//                 FOREIGN KEY('fName') REFERENCES'images'('fName') ON DELETE NO ACTION ON UPDATE CASCADE,
//                 UNIQUE INDEX('fName'),
//                 FULLTEXT INDEX('fName')
//             );
//        `
//     }, {
//         action: `createTagTable`,
//         sql: ``
//     }, {
//         action: `createLinkTagUsrTable`,
//         sql: ``
//     }
// ]







init();

function init() {
    checkCnnPool();
    delete sqls;
}

function checkCnnPool() {
    cnnPool.getConnection((error, cnn) => {
        if (error) {
            logger.error(`数据库连接池初始化失败 ${error}`);
        } else {
            cnn.query("SELECT 1 + 1 AS result", (error, data, feild) => {
                if (data.length >= 1 && data[0]['result'] == "2") {
                    logger.info("数据库连接池初始化成功");
                } else {
                    logger.error(`数据库连接池初始化失败 ${error}`);
                }
                cnn.release();    /** 切记归还连接到连接池 */
            })
        }
    })
    process.once("beforeExit", () => {
        logger.info(`关闭数据库`);
        cnnPool.end(error => {
            logger.error(`数据库关闭错误  ${erroe}`);
        });
    })
}

// function initTables() {
//     sqls.forEach(value => {
//         logger.trace(`检查数据库表：${value.action}`);
//         cnn.query(value.sql, error => {
//             logger.fatal(error);
//         })
//     })
// }


module.exports = {
    /**
     * 需要完整的文件名，包含文件的后缀  
     * 返回文件的路径
     * @param {*} fileName String  文件名
     */
    getThumbnailByfName: function (fileName, callback) {
        cnnPool.getConnection((error, cnn) => {
            cnn.query(`select * from images where fName='${fileName}';`, (error, data, field) => {
                if (error || data.length < 1) {
                    logger.error(`数据查询错误  ${fileName}`);
                } else {
                    return callback(data[0]);
                }


            })
        })
    },



    getHDByfName: function () { }
}
