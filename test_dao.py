#!/usr/bin/env python3
# -*- coding=utf-8 -*-
# coding=utf-8
'''
    @author       2020-1-17
    @time         2020-1-17
    @change       2020-1-17
    @description

    单元测试
    测试数据库模块功能完整性
'''

import unittest


class TestDAO(unittest.TestCase):
    def test_init(self):
        self.assertIsInstance(DBS(), DBS)


# 本地测试
if __name__ == "__main__":
    from lib.dao import DBS
    unittest.main()
