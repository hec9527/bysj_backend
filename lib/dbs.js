/**
 * @author     hc
 * @time       2020-4-18
 * @change     2020-4-26
 * 数据库表 配置文件
 *    数据库sql文件
 *    数据库表配置
 *    sql 属性将会在服务器启动的时候按照顺序执行
 */

const global_config = require('./config');
const items = {};
const config = {
    db_name: global_config.dbDatabase || bysj,
    table_user: 'users',
    table_image: 'images',
    table_biying: 'biying',
    table_english: 'jinshan',
    table_spider: 'spider',
};

// 数据库检测
items.db = {
    check: `SELECT * FROM information_schema.SCHEMATA where SCHEMA_NAME='${config.db_name}';`,
    init: `create database if not exists ${config.db_name};`,
    msg: '数据库',
};

// 360图片表
items.image = {
    check: `SELECT table_name FROM information_schema.TABLES WHERE table_name = '${config.table_image}';`,
    init: `CREATE TABLE IF NOT EXISTS ${config.table_image}(
    id INT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY, url varchar(256) NOT NULL,
    resolution varchar(15), category varchar(50), tag varchar(256), gary64 char(64));`,
    msg: '图片表',
};

// 必应美图
items.biying = {
    check: `SELECT table_name FROM information_schema.TABLES WHERE table_name ='${config.table_biying}';`,
    init: `CREATE TABLE IF NOT EXISTS ${config.table_biying}(
    id INT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY, url varchar(256) NOT NULL,
    title varchar(256), date char(10));`,
    msg: '必应每日表',
};

// 金山词典，每日英语
items.english = {
    check: `SELECT table_name FROM information_schema.TABLES WHERE table_name ='${config.table_english}';`,
    init: `CREATE TABLE IF NOT EXISTS ${config.table_english}(
    id INT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY, url varchar(256) NOT NULL,
    time char(10), english varchar(256), translate varchar(256), voice varchar(256));`,
    msg: '金山每日英语表',
};

// 用户表
items.user = {
    check: `SELECT table_name FROM information_schema.TABLES WHERE table_name ='${config.table_user}';`,
    init: `create table if not exists ${config.table_user}(
    id int(20) not null AUTO_INCREMENT PRIMARY KEY, count varchar(18) not null unique,
    passwd char(32) not null, permission int(1) default 3, name varchar(20) not null, 
    avator varchar(256), age int(3), sex int(1), addr varchar(50), motto varchar(80),
    qq varchar(13), wechat varchar(20), email varchar(20), phone char(11), level int(3),
    vip int(3), balance varchar(10), lasttime timestamp, forbidden varchar(20));`,
    msg: '用户表',
};

// 爬虫表  增加爬虫模块需要增加数据
items.spider = {
    check: `SELECT table_name FROM information_schema.TABLES WHERE table_name ='${config.table_spider}';`,
    init: `CREATE TABLE IF NOT EXISTS ${config.table_spider}(
      id int(20) not null AUTO_INCREMENT PRIMARY KEY,date char(10) not null,
      jinshan int(1), biying int(1), images int(1));`,
    msg: '爬虫表',
};

// 相关请求数据
// items.requets = {
//   check: ``,
//   init: ``,
//   msg: '网站数据',
// };

module.exports = { config, items };
