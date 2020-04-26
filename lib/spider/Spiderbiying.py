#!/usr/bin/env python3
# -*- coding=utf-8 -*-
# coding=utf-8
'''
    @author    hec9527
    @time      2020-4-12
    @change    2020-4-14
    @copyright 2020-20xx
    @description

    SpiderBiYing 模块
    用于从必应每日图片中获取图片以及图片的文字、故事

    ##  反爬虫比较麻烦   增加每个请求的间隔时间

    # 用于查询 从 2016年3月15日开始到现在的所有的 必应每日图片
    https://bing.ioliu.cn/?p=1
    # 用于快速查询必应最近7日的图片
    https://cn.bing.com/HPImageArchive.aspx?format=js&n=7&uhdwidth=3840&uhdheight=2160
    # 快速查找表中的所有category  ：select distinct category from spider;

    # 必应每日更新数据
    # 每周全量更新数据
'''

import requests
import re
from time import sleep
from lib.spider.dao import DBS
from lib.spider.logger import logger


class SpiderBiYing(object):
    def __init__(self):
        logger.info('spiderBiYing 模块启动中...')
        self.HEADER = {
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.5603.400 QQBrowser/10.1.1775.400",
        }
        self.DAO = DBS()
        self.API_HOST = 'https://bing.ioliu.cn/'
        self.API_PAGE = 1
        self.API_PAGEALL = None
        self.INTERVAL = 1  # 每次请求的间隔时间
        self.TOTAL = 0
        self.TOTAL_EXIST = 0
        self.start()

    def start(self):
        self.getAllPage()
        self.getAllLink()
        print(f"\nbiying数据获取完毕，总共:{self.TOTAL}张")

    # 遍历么一个页面获取页面中每个图片的链接
    def getAllLink(self):
        for page in range(1, int(self.API_PAGEALL) + 1):
            url = self.API_HOST + f"?p={page}"
            res = requests.get(url, headers=self.HEADER)
            self.parseLinks(res.text, page)

    def parseLinks(self, text, page):
        sleep(self.INTERVAL)
        pattern = re.compile(r'<a class="mark" href="(.*?)"></a>')
        results = pattern.findall(text)
        for link in results:
            url = self.API_HOST + link
            res = requests.get(url, headers=self.HEADER)
            self.parsePages(res.text, page)

    def parsePages(self, text, page):
        sleep(self.INTERVAL)
        img_url = self.findImage(text)
        img_date = self.findDate(text)
        img_title = self.findTitle(text)
        img_title = img_title.replace("'", '')
        if img_date is not None and self.DAO.selectFromBiying(
                img_date) is None:
            self.DAO.insertBiying(img_url, img_date, img_title)
            self.TOTAL += 1
            print(f"find image count: {self.TOTAL}  页数:{page}/{self.API_PAGEALL} ", end='\r')
        else:
            self.TOTAL_EXIST += 1
            print(f"image exist count: {self.TOTAL_EXIST} 页数:{page}/{self.API_PAGEALL}", end='\r')

    def findDate(self, text):
        try:
            pattern = re.compile(r'<em class=\"t\">(.*?)</em>')
            results = pattern.findall(text)
            return results[4]
        except Exception as e:
            logger.warning(e)
            return None

    def findTitle(self, text):
        try:
            pattern = re.compile(r'<p class=\"title\">(.*?)</p>')
            results = pattern.findall(text)
            return results[0]
        except Exception as e:
            logger.warning(e)
            return None

    def findImage(self, text):
        try:
            pattern = re.compile(r'data-progressive=\"(.*?)\?')
            results = pattern.findall(text)
            return results[0]
        except Exception as e:
            logger.warning(e)
            return None

    # 获取页面的总数
    def getAllPage(self):
        url = self.API_HOST + "?p=1"
        res = requests.get(url, headers=self.HEADER)
        res = res.text
        pages = re.search(r'<span>1.*?(\d*)</span>', res)
        self.API_PAGEALL = pages.group(1)
        logger.info(f'总共找到图片的页数{self.API_PAGEALL}')

    # 模块运行结束
    def __del__(self):
        logger.info('SpiderBiYing爬取进程运行结束')
