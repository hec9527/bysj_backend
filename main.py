# /bin/bash/env python3
# -*- coding=utf-8 -*-
# coding=utf-8
"""
    主模块
    在此处导入其它模块，并且调用他们的启动函数
    多线程技术
"""
from sys import argv
from time import time
from threading import Thread
# 日志模块
from lib.spider.logger import logger
# 360壁纸爬取模块
from lib.spider.spider360 import Spider360
# 蓝调壁纸
# from lib.spiderLcoc import SpiderLcoc
# 必应每日图片
from lib.spider.Spiderbiying import SpiderBiYing
# 金山词典
from lib.spider.SpiderJinshan import SpiderJinShan


class Spider(object):
    def __init__(self):
        logger.info('爬虫模块启动...')
        # 计时开始
        self.START_TIME = time()
        # 爬虫进程
        self.list_process = []
        # 相关爬虫模块
        self.list_lib = self.filterSpider()
        # 启动爬虫进程
        self.set_up()

    def filterSpider(self):
        # Spider360   SpiderBiYing  SpiderJinShan
        lis = []
        if len(argv) <= 1:
            return lis
        elif "360" in argv or 'all' in argv:
            lis.append(Spider360)
        elif 'bing' in argv or 'all' in argv:
            lis.append(SpiderBiYing)
        elif 'jinshan' in argv or 'all' in argv:
            lis.append(SpiderJinShan)
        return lis

    def set_up(self):
        logger.info(f'爬虫进程：{self.list_lib}')
        for lib in self.list_lib:
            self.list_process.append(Thread(target=lib))
        for task in self.list_process:
            task.setDaemon(True)
            task.start()
        for task in self.list_process:
            task.join()

    def __del__(self):
        during_time = time() - float(self.START_TIME)
        logger.info('爬虫模块运行结束, 耗时：%fs', during_time)


# start
if __name__ == '__main__':
    Spider()
