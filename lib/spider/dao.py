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
from lib.spider.logger import logger
from sys import exit


class DBS:
    def __init__(self, **args):
        logger.info("数据库模块启动...")
        # load config
        config_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "../../config/config.json"))
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
