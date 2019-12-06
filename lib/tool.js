/**
 * @author     hc
 * @time       2019-10-18
 * @change     2019-11-12
 * 工具函数模块
 * 
 * 修改日志： 
 *   2019-11-12
 *         修改getTimeString函数，由之前的 年月日时分秒随机数组成的字符串   修改为：年月日时组成的字符串，主要是防止每次启动服务器都会导致之前detoken全部失效  
 *         现在的改动在同一个小时内的token都是有效的
 * 
 */

const fs     = require("fs");
const path   = require("path");
const config = require("./config");
const logger = require("./logger");

module.exports = {
  /**
   * 获取文件的mime
   * @param {*} fPath String file path
   * @returns {*} String mime
   */
  getMime: function (fPath) {
    const mimes = {
      ".aac"  : "audio/aac",
      ".avi"  : "video/x-msvideo",
      ".bin"  : "application/octet-stream",
      ".bmp"  : "image/bmp",
      ".bz"   : "application/x-bzip",
      ".bz2"  : "application/x-bzip2",
      ".css"  : "text/css",
      ".csv"  : "text/csv",
      ".doc"  : "application/msword",
      ".docx" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".eot"  : "application/vnd.ms-fontobject",
      ".gif"  : "image/gif",
      ".htm"  : "text/html",
      ".html" : "text/html",
      ".ico"  : "image/vnd.microsoft.icon",
      ".jpeg" : "image/jpeg",
      ".jpg"  : "image/jpeg",
      ".js"   : "text/javascript",
      ".json" : "application/json",
      ".mjs"  : "text/javascript",
      ".mp3"  : "audio/mpeg",
      ".mpeg" : "video/mpeg",
      ".oga"  : "audio/ogg",
      ".ogv"  : "video/ogg",
      ".ogx"  : "application/ogg",
      ".otf"  : "font/otf",
      ".png"  : "image/png",
      ".pdf"  : "application/pdf",
      ".ppt"  : "application/vnd.ms-powerpoint",
      ".pptx" : "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ".rar"  : "application/x-rar-compressed",
      ".rtf"  : "application/rtf",
      ".svg"  : "image/svg+xml",
      ".swf"  : "application/x-shockwave-flash",
      ".tar"  : "application/x-tar",
      ".ttf"  : "font/ttf",
      ".txt"  : "text/plain",
      ".wav"  : "audio/wav",
      ".weba" : "audio/webm",
      ".webm" : "video/webm",
      ".webp" : "image/webp",
      ".woff" : "font/woff",
      ".woff2": "font/woff2",
      ".xhtml": "application/xhtml+xml",
      ".xls"  : "application/vnd.ms-excel",
      ".xlsx" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".xml"  : "application/xml",
      ".xul"  : "application/vnd.mozilla.xul+xml",
      ".zip"  : "application/zip",
      ".3gp"  : "video/3gpp",
      ".3g2"  : "video/3gpp2",
      ".7z"   : "application/x-7z-compressed",
    };
    const fExt = path.parse(fPath).ext;
    let   mime = mimes[fExt] || 'text/html';
    return mime;
  },


  /**
   * 获取当前时间的年月日时组成的字符串   
   * 格式： YYYYmmDDHH
   * @returns String  
   */
  getTimeString: function () {
    const date = new Date();
    return "" + date.getFullYear() + date.getMonth() + 1 + date.getDate() + date.getHours();
  },


  /**
   * 获取文件的二进制数据  |  读取文件   
   * 对fs模块中readfile的一个简单封装
   * @param {*} fPath String file path
   * @returns {*} Buffer  文件二进制内容
   */
  readFile: function (fPath, callback) {
    fPath = fPath ? fPath : "";
    fPath = path.join(config.staticPath, fPath);
    fs.stat(fPath, (error, stats) => {
      if (error) {
        logger.error(`${error}`);
        callback(false);
      } else {
        if (stats.isFile()) {
          fs.readFile(fPath, (error, data) => {
            if (!error) {
              callback({
                type: this.getMime(fPath),
                data: data
              })
            }
          })
        }
      }
    })
  },


  /**
   * 查询变量的数据类型    
   * Object | String | Array | Number | Null | Undefiend | Function 
   * @param {*} arg any 需要查询类型的变量
   * @returns {*} type 返回数据的类型如果出错则返回undefined 
   */
  typeof: function (arg) {
    try {
      return Object.prototype.toString.call(arg).slice(8, -1);
    } catch (error) {
      logger.error(error);
      return undefined;
    }
  },


  /**
   * 序列化对象，将对象转换为字符串格式
   * @param {*} arg 需要序列化的对象
   * @returns {*} String  返回序列化完成之后的字符串
   */
  Stringfiy: function (arg) {
    try {
      switch (this.typeof(arg)) {
        case "String": {
          return arg;
        }
        case "Undefined": {
          return '';
        }
        case "Null": {
          return '';
        }
        default: {
          return JSON.Stringfiy(arg);
        }
      }
    } catch (error) {
      logger.error(error);
      return '';
    }
  },



  /**
   * 反序列化，将字符串，二进制等形式的字符转为对象形式
   * @param {*} arg 解析的变量
   * @returns {*} obj 解析后的各种数据格式
   */
  Parse: function (arg) {
    try {
      switch (this.typeof(arg)) {
        case "Object": {
          return arg;
        }
        case "Array": {
          return arg;
        }
        case "Null": {
          return {};
        }
        case "Undefined": {
          return {};
        }
        default: {
          return JSON.parse(arg);
        }
      }
    } catch (error) {
      logger.error(error);
      return {};
    }
  },


  /**
   * 加密字符串，防止密码铭文保存   
   * 采用两次混合的方式加密
   * @param {*} str String 用于加密的字符串
   * @param {*} str String hex（16进制）编码格式的字符串
   */
  Encryption: function (str) {
    const crypto = require("crypto");
    const md5    = crypto.createHash("md5");
    return md5.update(String(str)).update(String(str)).digest("hex");
  },



  /**
   * 将对象转成等号，逗号连接的键值对
   * @param {*} obj Object 对象
   * @returns {*} String 
   */
  objToString: function (obj) {
    let str = '';
    for (key in obj) {
      str += `${key}='${obj[key]}',`;
    }
    str = str.slice(0, -1);
    return str;
  },


  /**
   * 获取本机的IP地址，返回为数组，包含多个IPv4地址
   * @returns {*} Array
   */
  getLocalHostIP: function () {
    const net = require("os").networkInterfaces();
    const ips = [];
    for (dev in net) {
      for (vCard in net[dev]) {
        if (net[dev][vCard]['family'] === 'IPv4' && net[dev][vCard]['address']) {
          ips.push(net[dev][vCard]['address']);
        }
      }
    }
    return ips;
  },








}

