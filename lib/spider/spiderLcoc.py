#!/usr/bin/env python3
# -*- coding=utf-8 -*-
# coding=utf-8
'''
    @author    hec9527
    @time      2020-3-30
    @change    2020-4-07
    @copyright 2020-20xx
    @description

    SpiderLcoc 模块
    用于从Lcoc网站的接口中爬取数据并且调用数据库模块数据持久化
    这个网站采用的也是360的接口，
    放弃
'''

import requests
import json
from re import sub


class SpiderLcoc(object):
    def __init__(self):
        logger.info('spiderLcoc 模块启动中... ')
        self.dbs = DBS
        self.types = [{"id": '360new', "name": "360最近"}]
        # 获取所有分类
        self.url_getType = 'http://lcoc.top/bizhi/api.php?cid=360tags'
        self.url_getWallpaper = 'http://lcoc.top/bizhi/api.php?cid=@type&start=@start&count=30'
        self.getAllType()
        # 获取每个分类的资源

    def getAllType(self):
        res = requests.get(self.url_getType).text
        res = json.loads(res)
        # 请求正常
        if (res.get('errno', 0) == '0' and res['data'][0] != []):
            print(res['data'])
            return
            self.types.extend(res['data'])
        else:
            logger.warn("蓝调接口错误...")
        self.getWallpaper()

    def getWallpaper(self):
        for item in self.types:
            Id = item['id']
            name = item['name']
            # 当前分类总数
            total = 0
            # 计数当前分类计数
            start = 0
            while True:
                url = self.url_getWallpaper.replace('@type', str(Id)).replace(
                    '@start', str(start))
                res = requests.get(url).text
                res = json.loads(res)
                if (res.get('errno', 0) == '0'):
                    total = res['total']
                    data = res['data']
                    # print(total,data)
                break


if __name__ == "__main__":
    # 模块测试
    from logger import logger
    from dao import DBS
    SpiderLcoc()
else:
    from lib.dao import DBS
    from lib.logger import logger
