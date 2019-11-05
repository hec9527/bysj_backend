/**
 * @author     hc
 * @time       2019-10-18
 * @change     2019-10-18
 * 工具函数模块
 */

const fs = require("fs");
const path = require("path");
const config = require("./config");
const logger = require("./logger");

module.exports = {
    /**
     * 获取文件的mime
     * @param {*} fPath String file path
     */
    getMime: function (fPath) {
        const mimes = {
            ".aac": "audio/aac",
            ".avi": "video/x-msvideo",
            ".bin": "application/octet-stream",
            ".bmp": "image/bmp",
            ".bz": "application/x-bzip",
            ".bz2": "application/x-bzip2",
            ".css": "text/css",
            ".csv": "text/csv",
            ".doc": "application/msword",
            ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".eot": "application/vnd.ms-fontobject",
            ".gif": "image/gif",
            ".htm": "text/html",
            ".html": "text/html",
            ".ico": "image/vnd.microsoft.icon",
            ".jpeg": "image/jpeg",
            ".jpg": "image/jpeg",
            ".js": "text/javascript",
            ".json": "application/json",
            ".mjs": "text/javascript",
            ".mp3": "audio/mpeg",
            ".mpeg": "video/mpeg",
            ".oga": "audio/ogg",
            ".ogv": "video/ogg",
            ".ogx": "application/ogg",
            ".otf": "font/otf",
            ".png": "image/png",
            ".pdf": "application/pdf",
            ".ppt": "application/vnd.ms-powerpoint",
            ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            ".rar": "application/x-rar-compressed",
            ".rtf": "application/rtf",
            ".svg": "image/svg+xml",
            ".swf": "application/x-shockwave-flash",
            ".tar": "application/x-tar",
            ".ttf": "font/ttf",
            ".txt": "text/plain",
            ".wav": "audio/wav",
            ".weba": "audio/webm",
            ".webm": "video/webm",
            ".webp": "image/webp",
            ".woff": "font/woff",
            ".woff2": "font/woff2",
            ".xhtml": "application/xhtml+xml",
            ".xls": "application/vnd.ms-excel",
            ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".xml": "application/xml",
            ".xul": "application/vnd.mozilla.xul+xml",
            ".zip": "application/zip",
            ".3gp": "video/3gpp",
            ".3g2": "video/3gpp2",
            ".7z": "application/x-7z-compressed",
        };
        const fExt = path.parse(fPath).ext;
        let mime = mimes[fExt] || 'text/html';
        return mime;
    },


    /**
     * 获取当前时间的字符串 
     * 格式： YYYYmmDDHHMMSS 
     */
    getTimeString: function () {
        const d = new Date();
        const Y = d.getFullYear();
        const m = d.getMonth() + 1;
        const D = d.getDate();
        const H = d.getHours();
        const M = d.getMinutes();
        const S = d.getSeconds();
        const R = Math.random() * 2000 | 0;
        return "" + Y + m + D + H + M + S + R;
    },

    
    /**
     * 获取文件的二进制数据  |  读取文件
     * @param {*} fPath String file path
     */
    getImageData: function (fPath, callback) {
        fPath = path.join(config.staticPath, fPath);
        fs.stat(fPath, (error, stats) => {
            if (error) {
                logger.error(`${error} ${fPath}`);
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


}