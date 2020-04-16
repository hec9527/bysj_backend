/**
 * @author    hc
 * @time      2019-10-18
 * @change    2020-4-16
 * 用户验证模块
 *     1. 给用户签发token
 *     2. 验证用户发回来的token
 *
 * 修改日志：
 *     2019-11-12：  1 新增Token解析
 *     2020-4-16   token 有效时间全局配置
 *
 */

const jwt = require('jsonwebtoken');
const config = require('./config');
const tool = require('./tool.js');
const logger = require('./logger');

const secret = config.jwtSecret + tool.getTimeString() || '';

module.exports = {
    /**
     * 用于加密用户信息生成Token
     * @param {*} option String | Object | Buffer 加密信息
     * @returns String 生成的用户token
     */
    getToken: function (option) {
        try {
            return jwt.sign(option, secret, {
                expiresIn: config.jwtExpiresIn,
            });
        } catch (error) {
            logger.warn(`用户Token签发失败：${error}`);
            return '';
        }
    },

    /**
     * 验证用户的token是否有效
     * @param {*} token String 用于的token
     */
    verifyToken: function (token) {
        try {
            if (jwt.verify(token, secret)) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    },

    /**
     * 解析Token  返回加密信息
     * @param {*} token token字符串
     * @returns {*} false | Object | Buffer | String
     */
    decodeToken: function (token) {
        try {
            if (this.verifyToken(token)) {
                return jwt.decode(token);
            }
        } catch (error) {
            return false;
        }
    },
};
