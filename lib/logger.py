#!/usr/bin/env python3
# coding=utf-8
# -*- coding=utf-8 -*-
"""
    日志模块
    用于打印日志到文件系统
    二级封装
"""

import logging

logger = logging.getLogger('default')

# NOTEST DEBUG INFO WARNING ERROR CRITICAL
logger.setLevel('INFO')

formater = logging.Formatter(
    "%(asctime)s [%(levelname)s] %(lineno)d：%(message)s")

# file hander
handler_file = logging.FileHandler(filename="./logs/pylog.log", mode='a+')
handler_file.setFormatter(formater)
handler_file.setLevel("INFO")

# std stream handler
handler_std = logging.StreamHandler()
handler_std.setFormatter(formater)
handler_std.setLevel("INFO")

# add handler
logger.addHandler(handler_file)
logger.addHandler(handler_std)
