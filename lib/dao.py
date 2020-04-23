'''
    @author    hec9527
    @time      2020-1-16
    @change    2020-1-16
    @description

    DB模块
    操作数据库，爬虫模块爬取到的数据并且存到数据库当中
'''

import os
import json
import pymysql.cursors
from sys import exit


class DBS:
    def __init__(self, **args):
        logger.info("数据库模块启动...")
        # load config
        config_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../config/config.json"))
        # load config
        with open(config_path) as file:
            self.config = json.load(file)
        # init cnn
        try:
            self.cnn = pymysql.connect(
                host=self.config.get("db_host", ''),
                user=self.config.get("db_user", ''),
                password=self.config.get("db_passwd", ''),
                db=self.config.get("db_database", ""),
                charset=self.config.get("db_charset", ''),
                cursorclass=pymysql.cursors.DictCursor)
        except Exception:
            logger.error('数据库连接初始化失败，请检查配置文件')
            exit()
        # check if databases is exist
        self.checkDB()

    # 检查数据库
    def checkDB(self):
        logger.info("数据库检查...")
        try:
            # 检查数据库是否存在
            sql = "SELECT * FROM information_schema.SCHEMATA where SCHEMA_NAME='bysj';"
            if self.myQuery(sql) is None:
                sql = "create database if not exists bysj;"
                self.myQuery(sql)
                logger.warning("数据库不存在，自动构建...")

            # 检查图片表是否存在
            sql = "SELECT table_name FROM information_schema.TABLES WHERE table_name ='images';"
            if self.myQuery(sql) is None:
                sql = "CREATE TABLE IF NOT EXISTS images(id INT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY, url varchar(256) NOT NULL, resolution varchar(15), category varchar(50), tag varchar(256)), gary64 char(64));"
                self.myQuery(sql)
                logger.warning("spider表不存在，自动构建...")

            # 检查必应每日表是否存在
            sql = "SELECT table_name FROM information_schema.TABLES WHERE table_name ='biying';"
            if self.myQuery(sql) is None:
                sql = "CREATE TABLE IF NOT EXISTS biying(id INT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY, url varchar(256) NOT NULL, title varchar(256), date char(10));"
                self.myQuery(sql)
                logger.warning("biying表不存在，自动构建...")

            # 检查每日英语表是否存在
            sql = "SELECT table_name FROM information_schema.TABLES WHERE table_name ='jinshan';"
            if self.myQuery(sql) is None:
                sql = "CREATE TABLE IF NOT EXISTS jinshan(id INT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY, url varchar(256) NOT NULL, time char(10), english varchar(256), translate varchar(256), voice varchar(256));"
                self.myQuery(sql)
                logger.warning("jinshan表不存在，自动构建...")

            # 检查用户表是否存在
            # TODO 用户表增加 权限   0 表示管理员  非 0 表示普通用户
            sql = "SELECT table_name FROM information_schema.TABLES WHERE table_name ='uesrs';"
            if self.myQuery(sql) is None:
                '''create table if not exists user(id int(20) not null AUTO_INCREMENT PRIMARY KEY, count varchar(18) not null unique, passwd 
                    char(32) not null, permission int(1) default 3, name varchar(20) not null unique, avator varchar(256), age int(3), sex int(1), addr varchar(50), motto varchar(8
                    0), qq varchar(13), wechat varchar(20), email varchar(20), phone int(11), level int(3), vip int(3), balance varchar(10), lasttime 
                    timestamp, forbidden varchar(20));
                    '''
                sql = "CREATE TABLE IF NOT EXISTS user(id INT(20) NOT NULL AUTO_INCREMENT PRIMARY KEY); "
                self.myQuery(sql)
                logger.warning("users表不存在，自动构建...")
        except Exception:
            logger.critical("数据库初始化错误，请检查数据库配置")
            exit()

    # 插入数据到图片表
    def insertImage(self, url, tag, reso, category):
        sql = f"insert into images(url, category, tag, resolution) values('{url}', '{category}', '{tag}', '{reso}');"
        return self.myQuery(sql)

    # 插入数据到biying表
    def insertBiying(self, url, date, title):
        sql = f"INSERT INTO biying(url, date, title) values('{url}', '{date}', '{title}');"
        return self.myQuery(sql)

    # 从必应表搜索数据
    def selectFromBiying(self, date):
        sql = f"SELECT * FROM biying WHERE date='{date}';"
        return self.myQuery(sql)

    # 插入数据到金山词典
    def insertJinShan(self, time, url, english, translate, voice):
        sql = f"INSERT INTO jinshan(time, url, english, translate, voice) values('{time}', '{url}', '{english}', '{translate}', '{voice}');"
        return self.myQuery(sql)

    # 从金山词典中检查数据
    def selectFromJinShan(self, time):
        sql = f"SELECT * FROM jinshan WHERE time='{time}';"
        return self.myQuery(sql)

    # 封装的查询方法，减少重复代码的编写
    def myQuery(self, sql):
        try:
            cur = self.cnn.cursor()
            cur.execute(sql)
            self.cnn.commit()
            return cur.fetchone()
        except Exception as e:
            logger.error(e)
            return False
        finally:
            cur.close()

    # 释放链接
    def __del__(self):
        self.cnn.close()
        logger.info('数据库连接关闭')


# 开发测试
if __name__ == "__main__":
    db = DBS()
    from lib.logger import logger
else:
    from lib.logger import logger
