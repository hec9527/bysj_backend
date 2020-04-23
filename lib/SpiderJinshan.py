#!/usr/bin/env python3
# -*- coding=utf-8 -*-
# coding=utf-8
'''
    @author    hec9527
    @time      2020-4-14
    @change    2020-4-14
    @copyright 2020-20xx
    @description

    金山词典每日英语  模块

    从金山中获取每日的图片数据、文字数据、音频数据
'''

import requests
from datetime import date, timedelta
from time import sleep
from json import loads
from lib.dao import DBS
from lib.logger import logger


class SpiderJinShan(object):
    def __init__(self):
        logger.info('spiderJinShan 模块启动中...')
        self.HEADER = {
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.5603.400 QQBrowser/10.1.1775.400",
        }
        self.DAO = DBS()
        self.API_HOST = r'http://sentence.iciba.com/index.php?c=dailysentence&m=getdetail&title='
        self.DATE_LIS = []
        self.INTERVAL = 0.5
        self.TOTAL = 0
        self.TOTAL_EXIST = 0
        self.start()

    def start(self):
        self.dayDateRange()
        self.parseLink()

    def parseLink(self):
        for d in self.DATE_LIS:
            url = self.API_HOST + d
            res = requests.get(url, headers=self.HEADER)
            if res.status_code == 200:
                res.encoding = 'utf-8'
                self.parseJSON(res.text)
                sleep(self.INTERVAL)
            else:
                print(f"数据获取出错：{d}")
                continue

    def parseJSON(self, text):
        dic = loads(text)
        time = dic['title']
        url = dic['picture2']
        english = dic['content'].replace("'", '')
        translate = dic['note'].replace("'", '')
        voice = dic['tts']
        if self.DAO.selectFromJinShan(time) is None:
            self.DAO.insertJinShan(time, url, english, translate, voice)
            self.TOTAL += 1
            print(f'fetched data: {self.TOTAL}', end='\r')
        else:
            self.TOTAL_EXIST += 1
            print(f"fetch exist daat: {self.TOTAL}\n")

    # 获取最近7天的日期字符串
    def dayDateRange(self):
        for i in range(0, 100):
            yesterday = (date.today() + timedelta(days=-i)).strftime("%Y-%m-%d")  # 昨天日期
            self.DATE_LIS.append(yesterday)

    # 模块运行结束
    def __del__(self):
        logger.info(f'SpiderJinShan爬取进程运行结束, 新获取数据:{self.TOTAL}, 过滤已存在：{self.TOTAL_EXIST}')
