#!/usr/bin/env python3
# -*- coding=utf-8 -*-
# coding=utf-8
'''
    @author    hec9527
    @time      2020-1-16
    @change    2020-1-16
    @copyright 2020-20xx
    @description

    Spider360 模块
    用于从360壁纸APP的数据接口中爬取数据并且调用数据库模块数据持久化
    # 快速查找表中的所有category  ：select distinct category from spider;
'''

import requests
import json
from re import sub
from lib.dao import DBS
from lib.logger import logger


class Spider360(object):
    def __init__(self):
        logger.info('spider360 模块启动中...')
        self.header = {
            "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.26 Safari/537.36 Core/1.63.5603.400 QQBrowser/10.1.1775.400",
        }
        self.header1 = {
            "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding":
            "gzip, deflate",
            "Accept-Language":
            "zh-CN,zh;q=0.9,en;q=0.8",
            "Cache-Control":
            "no-cache",
            "Connection":
            "keep-alive",
            "Cookie":
            "__guid=92280206.530040451316176400.1579142607132.9788; Q=u%3D360H2548941901%26n%3D%26le%3D%26m%3DZGtmWGWOWGWOWGWOWGWOWGWOAQZ2%26qid%3D2548941901%26im%3D1_t01dbdd7e726a89e0ec%26src%3Dpcw_so_image_qq%26t%3D1; T=s%3Dcfec7fa03be89cefab2bd998153c13fc%26t%3D1579142992%26lm%3D%26lf%3D%26sk%3D2d7d2aa636fd90ec7e4053dc960da44b%26mt%3D1579142992%26rc%3D%26v%3D2.0%26a%3D1",  # yapf: disabled
            "Host":
            "wallpaper.apc.360.cn",
            "Pragma":
            "no-cache",
            "Upgrade-Insecure-Requests":
            "1",
            "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
        }
        self.API_HOST = 'http://wallpaper.apc.360.cn/index.php?from=360chrome&c=WallPaper'
        self.API_TYPE = '&a=getAllCategoriesV2'
        self.API_NEW = '&a=getAppsByOrder&order=create_time&start=@parmas&count=@parmas'
        self.API_ARG = '&a=getAppsByCategory&cid=@parmas&start=@parmas&count=@parmas'
        self.dao = DBS()
        self.start()

    def start(self):
        # TODO 完成360图片最新图片获取的功能
        # self.getNEWS()
        self.getAll()

    # 获取最新，360最新数据每次只更新180条，所以可以全部更新
    def getNEWS(self):
        logger.info('开始获取360壁纸最新数据。。。')
        start, page, fetched, total = 0, 30, 0, 0
        # 循环获取最新
        while True:
            url = self.API_NEW.replace("@parmas", str(start),
                                       1).replace("@parmas", str(page))
            res = self.getText(self.API_HOST + url, self.header)
            data = json.loads(res).get("data", '')
            if isinstance(data, list) and len(data) > 0:
                for item in data:
                    print(f"fetching --> {total}", end='\r')
                    url = sub(r'__\d\d', "__100", item['url'])
                    tag = item['tag']
                    result = self.dao.insert(url, tag)
                    if result is None:
                        fetched += 1
                    total += 1
                start += 1
            else:
                break
        logger.info(f'spider360--getNews运行结束,总共获取{fetched}/{total}张图片')

    def getAll(self):
        logger.info('开始获取360壁纸全部数据')
        url = self.API_HOST + self.API_TYPE
        res = self.getText(url, self.header)
        data = json.loads(res).get('data', '')
        totalALl, fetchedAll = 0, 0
        if isinstance(data, list) and len(data) > 0:
            for cate in data:
                cid, category, start, count, fetched, total = cate['id'], cate[
                    'name'], 0, 150, 0, 0
                while True:
                    # cid   start    count
                    url = self.API_HOST + self.API_ARG.replace(
                        '@parmas', str(cid), 1).replace(
                            "@parmas", str(start), 1).replace(
                                "@parmas", str(count))
                    res = self.getText(url, self.header)
                    res = json.loads(res)
                    total = int(res.get("total", 0))
                    lis = res.get('data', '')
                    if isinstance(lis, list) and len(lis) > 0:
                        for item in lis:
                            print(f'fetching  ---> {category}: {fetched}',
                                  end="\r")
                            url = sub(r'__\d\d', "__100", item['url'])
                            tag = item['tag']
                            reso = item['resolution'].replace("*", "x")
                            result = self.dao.insertImage(
                                url, tag, reso, category)
                            if result is None:
                                fetched += 1
                            if (fetched >= total):
                                totalALl += total
                                fetchedAll += fetched
                                print(
                                    f"fetched ---> 分类：{category}  总计：{fetched}"
                                )
                                break
                        else:
                            continue
                        break
        logger.info(f'spider360--getAll运行结束，总共获取{fetchedAll}/{totalALl}张图片')

    # 获取二进制内容
    def getContext(self, url, header):
        res = requests.get(url, headers=header)
        if 200 <= res.status_code <= 300:
            return res.content
        else:
            return ''

    # 获取文本内容
    def getText(self, url, header):
        res = requests.get(url, headers=header)
        if 200 <= res.status_code <= 300:
            res.encoding = res.apparent_encoding
            return res.text
        else:
            return ''

    # 模块运行结束
    def __del__(self):
        # 后期再更改
        logger.info('spider360爬取进程运行结束')
