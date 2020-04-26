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
        logger.info(f'爬虫进程：{self.list_lib}')
        return
        # 启动爬虫进程
        self.set_up()

    def filterSpider(self):
        lis = [Spider360, SpiderBiYing, SpiderJinShan]
        if len(argv) <= 1 or 'all' in argv:
            return lis
        elif "360" not in argv:
            lis.remove(Spider360)
        elif 'bing' not in argv:
            lis.remove(SpiderBiYing)
        elif 'jinshan' not in argv:
            lis.remove(SpiderJinShan)
        return lis

    def set_up(self):
        for lib in self.list_lib:
            # TODO 改成多线程模式，主线程守护子线程，子线程全部关闭之后结束主线程
            self.list_process.append(lib())

    def __del__(self):
        during_time = time() - float(self.START_TIME)
        logger.info('爬虫模块运行结束, 耗时：%fs',during_time)


# start
if __name__ == '__main__':
    Spider()
