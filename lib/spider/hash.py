# /bin/bash/env python3
# -*- coding=utf-8 -*-
# coding=utf-8
'''
    图片相似度判定
    通过图片的汉明距离判定图片的相似度
'''

from PIL import Image
from functools import reduce
import time
from sys import argv

# 计算图片hash
def phash(img):
    pass
    img = img.resize((8, 8), Image.ANTIALIAS).convert("L")
    avg = reduce(lambda x, y: x + y, img.getdata()) / 64.
    return reduce(lambda x, y: x | (y[1] << y[0]),
                  enumerate(map(lambda i: 0
                                if i < avg else 1, img.getdata())), 0)


# 计算汉明距离
def hamming_distance(a, b):
    return bin(a ^ b).count('1')


# 计算图片相似度
def getImageSlimilar(img1, img2):
    slimilar = hamming_distance(phash(img1), phash(img2))
    print(f"图片汉明距离： {slimilar}")
    return True if slimilar <= 10 else False


# 入口函数
def main(path1, path2):
    img1 = Image.open(path1)
    img2 = Image.open(path2)

    start_time = time.time()
    similarRank = getImageSlimilar(img1, img2)
    print(f"这两张图片{'' if bool(similarRank) else '不'}相似, 耗时：",
          time.time() - start_time)


if __name__ == '__main__':
    path1 = argv[1]
    path2 = argv[2]
    main(path1, path2)
