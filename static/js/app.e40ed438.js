(function(e){function t(t){for(var r,a,u=t[0],i=t[1],s=t[2],f=0,l=[];f<u.length;f++)a=u[f],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&l.push(o[a][0]),o[a]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);g&&g(t);while(l.length)l.shift()();return c.push.apply(c,s||[]),n()}function n(){for(var e,t=0;t<c.length;t++){for(var n=c[t],r=!0,a=1;a<n.length;a++){var u=n[a];0!==o[u]&&(r=!1)}r&&(c.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},a={app:0},o={app:0},c=[];function u(e){return i.p+"js/"+({}[e]||e)+"."+{"chunk-633b7710":"a6feb2d8","chunk-63c9552b":"3bf73e97","chunk-6f585c0a":"011de206","chunk-977226ca":"20132fbb","chunk-9dc8c54a":"bc4a015b","chunk-a7a15978":"adbff0b6","chunk-e423a1f0":"4741bb9d","chunk-f12e8394":"1f1977e9"}[e]+".js"}function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.e=function(e){var t=[],n={"chunk-633b7710":1,"chunk-63c9552b":1,"chunk-6f585c0a":1,"chunk-977226ca":1,"chunk-9dc8c54a":1,"chunk-a7a15978":1,"chunk-e423a1f0":1,"chunk-f12e8394":1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise((function(t,n){for(var r="css/"+({}[e]||e)+"."+{"chunk-633b7710":"e1aad73b","chunk-63c9552b":"1c737a24","chunk-6f585c0a":"d6b2afdd","chunk-977226ca":"2b47dac0","chunk-9dc8c54a":"fdce1e0c","chunk-a7a15978":"ade95261","chunk-e423a1f0":"dc10bda3","chunk-f12e8394":"05a7282e"}[e]+".css",o=i.p+r,c=document.getElementsByTagName("link"),u=0;u<c.length;u++){var s=c[u],f=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(f===r||f===o))return t()}var l=document.getElementsByTagName("style");for(u=0;u<l.length;u++){s=l[u],f=s.getAttribute("data-href");if(f===r||f===o)return t()}var g=document.createElement("link");g.rel="stylesheet",g.type="text/css",g.onload=t,g.onerror=function(t){var r=t&&t.target&&t.target.src||o,c=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");c.code="CSS_CHUNK_LOAD_FAILED",c.request=r,delete a[e],g.parentNode.removeChild(g),n(c)},g.href=o;var d=document.getElementsByTagName("head")[0];d.appendChild(g)})).then((function(){a[e]=0})));var r=o[e];if(0!==r)if(r)t.push(r[2]);else{var c=new Promise((function(t,n){r=o[e]=[t,n]}));t.push(r[2]=c);var s,f=document.createElement("script");f.charset="utf-8",f.timeout=120,i.nc&&f.setAttribute("nonce",i.nc),f.src=u(e);var l=new Error;s=function(t){f.onerror=f.onload=null,clearTimeout(g);var n=o[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;l.message="Loading chunk "+e+" failed.\n("+r+": "+a+")",l.name="ChunkLoadError",l.type=r,l.request=a,n[1](l)}o[e]=void 0}};var g=setTimeout((function(){s({type:"timeout",target:f})}),12e4);f.onerror=f.onload=s,document.head.appendChild(f)}return Promise.all(t)},i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/",i.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],f=s.push.bind(s);s.push=t,s=s.slice();for(var l=0;l<s.length;l++)t(s[l]);var g=f;c.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"07a4":function(e,t,n){"use strict";n("99af");var r=n("5530"),a=n("2b0e"),o=n("2f62");n("4f72");a["default"].use(o["a"]),t["a"]=new o["a"].Store({state:{userInfo:{all:{},basic:{userToken:void 0,userName:void 0}},searchInfo:{total:0,count:0,kw:"",data:[],len:30},categoryInfo:{total:0,count:0,category:"",data:[],len:30},allCategory:[],bingDaily:[],englishDaily:{},userList:[],systemLog:[],systemConfig:{}},actions:{},mutations:{FETCH_SERVER_CONFIG:function(e,t){e.systemConfig=t},FETCH_SYSTEM_LOG:function(e,t){e.systemLog=t},UPDATE_USER_LIST:function(e,t){e.userList=t},UPDATE_USER_INFO:function(e,t){e.userInfo.basic={userToken:t.token,userName:t.userName||this.state.userInfo.basic.userName}},UPDATE_USER_INFO_ALL:function(e,t){e.userInfo.all=Object(r["a"])({},t)},UPDATE_ALL_CATEGORY:function(e,t){e.allCategory=t},UPDATE_CATEGORY_RESULT:function(e,t){e.categoryInfo={total:t.total,count:t.count,category:t.category,data:e.categoryInfo.data.concat(t.data),len:e.categoryInfo.len}},UPDATE_CATEGORY_INFO:function(e,t){e.categoryInfo={total:0,count:0,category:t,data:[],len:30}},UPDATE_SEARCH_RESULT:function(e,t){e.searchInfo={kw:t.kw,total:t.total,count:t.count,data:e.searchInfo.data.concat(t.data),len:e.searchInfo.len}},UPDATE_SEARCH_INFO:function(e,t){e.searchInfo={total:0,count:0,kw:t,data:[],len:30}},UPDATE_BINY_DAILY:function(e,t){e.bingDaily=t},UPDATE_DAILY_ENGLISH:function(e,t){e.englishDaily=t}},getters:{getSearchInfo:function(e){return e.searchInfo},getAllCategory:function(e){return e.allCategory},getCategoryInfo:function(e){return e.categoryInfo},getCurrentCategory:function(e){return e.categoryInfo.category},getBingDaily:function(e){return e.bingDaily},getDailyEnglish:function(e){return e.englishDaily},getUserBasicInfo:function(e){return e.userInfo.basic},getUserAllInfo:function(e){return e.userInfo.all},getUserpermission:function(e){return e.userInfo.all.permission},getAllUserInfo:function(e){return e.userList},getSystemLog:function(e){return e.systemLog},getSystemConfig:function(e){return e.systemConfig}}})},"328d":function(e,t,n){"use strict";n("ac1f"),n("841c");var r=n("90fb"),a={};a.host=window.location.host,a.parmas=window.location.search,a.SEARCH_KEYWORLD=r["a"]+"/a/get/home/keyworld",a.BIYING_SEVERN_DAY=r["a"]+"/a/get/getBingDaily",a.ENGLIST_DAILY_POST=r["a"]+"/a/get/getEnglishDaily",a.FORWRAD_REQUEST=r["a"]+"/a/get/forward",a.IMAGES_TYPE_INFO=r["a"]+"/a/get/getImageCategory",a.IMAGE_TYPE_DATA=r["a"]+"/a/get/getImageByCategory",a.IMAGES_LOAD_ERROR=r["a"]+"/a/get/imageLoadError",a.USER_LOGIN=r["a"]+"/a/post/userLogin",a.USER_REGIST=r["a"]+"/a/post/userRegist",a.GET_USER_INFO_ALL=r["a"]+"/v/get/userInfo",a.SPIDER_NEW_DATA=r["a"]+"/m/spiderNewData",a.GET_ALL_USER_INFO=r["a"]+"/m/get/allUserInfo",a.DELETE_USER_INFO=r["a"]+"/m/delete/userInfo",a.UPDATE_USER_INFO=r["a"]+"/m/update/userInfo",a.ADD_USER_INFO=r["a"]+"/m/add/userInfo",a.GET_SYSTEM_LOG=r["a"]+"/m/get/systemLogs",a.GET_IMAGES_INFO=r["a"]+"/m/get/imageInfo",a.DELETE_IMAGE_INFO=r["a"]+"/m/del/imageInfo",a.GET_SERVER_CONFIG=r["a"]+"/m/get/serverConfig",a.UPDATE_SERVER_CONFIG=r["a"]+"/m/post/saveServerConfig",a.RESTART_SERVER=r["a"]+"/m/get/restartServer",a.SHUTDOWN_SERVER=r["a"]+"/m/get/shutdownServer",a.IMAGE_IDENTIFY=r["a"]+"/a/post/imageIdentify",a.BAIDU_IMAGE_DOWNLOADER="http://image.baidu.com/search/down?tn=download&word=download&ie=utf8&fr=detail&url=",t["a"]=a},"346c":function(e,t,n){},"452c":function(e,t,n){},"4f72":function(e,t,n){"use strict";n.d(t,"g",(function(){return c})),n.d(t,"h",(function(){return u})),n.d(t,"d",(function(){return i})),n.d(t,"b",(function(){return s})),n.d(t,"a",(function(){return f})),n.d(t,"j",(function(){return l})),n.d(t,"f",(function(){return g})),n.d(t,"i",(function(){return d})),n.d(t,"e",(function(){return h})),n.d(t,"c",(function(){return m}));n("99af"),n("a623"),n("4160"),n("d81d"),n("fb6a"),n("b64b"),n("ac1f"),n("5319"),n("1276"),n("159b");var r=n("328d"),a=[{pattern:/^(.{0,6}|.{19,})$/,message:"请输入6到18位的用户名"},{pattern:/^\d/,message:"用户名不能使用数字开头"},{pattern:/['|"]/,message:"用户名不能包含单双引号"},{pattern:/[\u4e00-\u9fa5]/,message:"用户名不能使用汉字"}],o=[{pattern:/^(.{0,6}|.{19,})$/,message:"请输入8到18位的密码"},{pattern:/[\u4e00-\u9fa5]/,message:"不能使用汉字作为密码"}];function c(e){return e.map((function(e){return e.cover=e.url.replace(/__\d*/,"__30"),e.cover30=e.cover,e.cover50=e.url.replace(/__\d*/,"__50"),e.cover70=e.url.replace(/__\d*/,"__70"),e.cover85=e.url.replace(/__\d*/,"__85"),e.cover100=e.url,e}))}function u(e,t){var n="";return Object.keys(t).forEach((function(e){n+="".concat(e,"=").concat(t[e],"&")})),e+"?"+n.slice(0,-1)}function i(e){var t=document.createElement("a"),n=e.split("/");t.download?(t.download=n[n.length-1],t.href=e):(t.download=n[n.length-1],t.href=r["a"].BAIDU_IMAGE_DOWNLOADER+e),t.click()}function s(e,t){var n={flag:!0,message:""},r=function(e,t){return e.pattern.test(t)&&(n={flag:!1,message:e.message}),!0};return a.every((function(t){return r(t,e)})),n.flag?(o.every((function(e){return r(e,t)})),n):n}function f(e,t,n){return t!==n?{flag:!1,message:"两次输入的密码不一致"}:s(e,t)}function l(e){localStorage.setItem("userName",e)}function g(){return localStorage.getItem("userName")||void 0}function d(e,t){sessionStorage.setItem("userName",e),sessionStorage.setItem("token",t)}function h(){var e=sessionStorage.getItem("userName"),t=sessionStorage.getItem("token");return{userName:e,token:t}}function m(){sessionStorage.removeItem("userName"),sessionStorage.removeItem("token")}},"557b":function(e,t,n){},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("div",{staticClass:"theme",class:e.themeBackground}),n("div",{staticClass:"animation fead-down",attrs:{id:"nav"}},[n("router-link",{staticClass:"nav-items",attrs:{to:"/home"}},[e._v("首页")]),n("el-popover",{staticClass:"nav-items",attrs:{placement:"bottom",width:"160",trigger:"hover"}},[n("div",{staticClass:"category-wrap"},e._l(e.category,(function(t,r){return n("div",{key:r,staticClass:"image-category",on:{click:function(n){return e.handleCategoryChange(t)}}},[e._v(" "+e._s(t)+" ")])})),0),n("router-link",{staticClass:"nav-items",attrs:{slot:"reference",to:"/category"},slot:"reference"},[n("span",{on:{click:function(t){return e.handleCategoryChange(e.category[0])}}},[e._v(" 分类")])])],1),n("router-link",{staticClass:"nav-items",attrs:{to:"/bing"}},[e._v("必应美图")]),n("router-link",{staticClass:"nav-items",attrs:{to:"/daily"}},[e._v("每日英语")]),e.userBasicInfo.userToken?n("router-link",{staticClass:"nav-items",attrs:{to:"/share"}},[e._v("分享")]):e._e(),0===e.userPermission?n("router-link",{staticClass:"nav-items",attrs:{to:"/manager"}},[e._v("管理")]):e._e(),n("router-link",{staticClass:"nav-items",attrs:{to:"/indi"}},[e._v("个人中心")])],1),n("router-view",{staticClass:"routerView"})],1)},o=[],c=n("5530"),u=n("bf92"),i=n("4f72"),s=n("2f62"),f=n("5c96"),l=n.n(f),g={data:function(){return{themeBackground:"theme-bg"}},mounted:function(){var e=this;console.log("App mounted"),this.$store.commit("UPDATE_USER_INFO",Object(i["e"])()),u["a"].fetchAllCategory().then((function(t){e.$store.commit("UPDATE_ALL_CATEGORY",t.data)})),u["a"].fetchUserInfoAll().then((function(t){e.$store.commit("UPDATE_USER_INFO_ALL",t.data)}),(function(){e.$store.commit("UPDATE_USER_INFO_ALL",{}),e.$store.commit("UPDATE_USER_INFO",{token:void 0})}))},computed:{category:function(){return this.getAllCategory()},userBasicInfo:function(){return this.getUserBasicInfo()},userAllInfo:function(){return this.getUserAllInfo()},userPermission:function(){return this.getUserpermission()}},methods:Object(c["a"])({handleCategoryChange:function(e){this.getCurrentCategory()!==e&&this.$store.commit("UPDATE_CATEGORY_INFO",e),window.location.hash="/category"}},Object(s["b"])(["getAllCategory","getCurrentCategory","getUserBasicInfo","getUserAllInfo","getUserpermission"])),components:{elPopover:f["Popover"]},updated:function(){}},d=g,h=(n("5e97"),n("b0a0"),n("2877")),m=Object(h["a"])(d,a,o,!1,null,"9a69dc18",null),_=m.exports,E=(n("d3b7"),n("07a4")),p=n("8c4f");r["default"].use(p["a"]);var I=[{path:"/",name:"root",redirect:"/home"},{path:"/home",name:"home",component:function(){return n.e("chunk-9dc8c54a").then(n.bind(null,"6511"))}},{path:"/search",name:"search",component:function(){return n.e("chunk-f12e8394").then(n.bind(null,"4e22"))}},{path:"/category",name:"category",component:function(){return n.e("chunk-633b7710").then(n.bind(null,"8fce"))}},{path:"/share",name:"share",meta:{requireAuth:!0},component:function(){return n.e("chunk-a7a15978").then(n.bind(null,"6d9f"))}},{path:"/manager",name:"manager",meta:{requireAuth:!0},component:function(){return n.e("chunk-6f585c0a").then(n.bind(null,"0943"))}},{path:"/bing",name:"bing",component:function(){return n.e("chunk-63c9552b").then(n.bind(null,"91a7"))}},{path:"/daily",name:"daily",component:function(){return n.e("chunk-e423a1f0").then(n.bind(null,"d04a"))}},{path:"/indi",name:"individual",component:function(){return n.e("chunk-977226ca").then(n.bind(null,"3fb6"))}}],v=new p["a"]({linkActiveClass:"nav-this",routes:I});v.beforeEach((function(e,t,n){e.meta.requireAuth&&(E["a"].state.userInfo.basic.userToken||n({path:"/home",query:{redirect:e.fullPath}})),n()}));var b=v;var A=n("fffc"),y=n.n(A);n("557b"),n("346c"),n("c98c"),n("0fae");r["default"].use(l.a),r["default"].use(y.a),r["default"].config.productionTip=!0,new r["default"]({el:"#app",store:E["a"],router:b,render:function(e){return e(_)}})},"5e97":function(e,t,n){"use strict";var r=n("fb76"),a=n.n(r);a.a},"90fb":function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var r="http://localhost:8008"},b0a0:function(e,t,n){"use strict";var r=n("452c"),a=n.n(r);a.a},bf92:function(e,t,n){"use strict";n("d3b7");var r=n("bc3a"),a=n.n(r),o=n("07a4"),c=n("90fb"),u=n("5c96"),i={},s=a.a.create({timeout:1e4,baseUrl:c["a"],withCredentials:!0,validateStatus:function(e){switch(e){case 400:u["Notification"].error("请求出错");break;case 401:return void u["Notification"].warning("授权失败，请重新登录");case 403:u["Notification"].error("拒绝访问");break;case 404:u["Notification"].error("请求资源未找到");break;case 500:u["Notification"].error("服务器错误");break}return e>=200&&e<300}});s.interceptors.request.use((function(e){var t=o["a"].state.userInfo.basic.userToken;return t&&(e.headers.Authorization=t),e}),(function(e){return Promise.reject(e)})),s.interceptors.response.use((function(e){return 200===e.status||u["Notification"].warning(e.statusText),e.data}),(function(e){return u["Notification"].error("服务器失联了~~~~"),Promise.reject(e)})),i.get=function(e,t){return new Promise((function(n,r){s.get(e,t).then((function(e){0===e.code?n(e):(u["Notification"].error(e.msg),r(e))}),(function(e){u["Notification"].error(e.msg),r(e)}))}))},i.post=function(e,t,n){return new Promise((function(r,a){s.post(e,t,n).then((function(e){0===e.code?r(e):(u["Notification"].error(e.msg),a(e))}),(function(e){u["Notification"].error(e.msg),a(e)}))}))};var f=i,l=n("328d"),g=n("4f72"),d={fetchKeyWorkds:function(e){var t=Object(g["h"])(l["a"].SEARCH_KEYWORLD,e);return f.get(t)},fetchAllCategory:function(){return f.get(l["a"].IMAGES_TYPE_INFO)},fetchCategoryImage:function(e){var t=Object(g["h"])(l["a"].IMAGE_TYPE_DATA,e);return f.get(t)},feedImageLoadError:function(e){var t=Object(g["h"])(l["a"].IMAGES_LOAD_ERROR,e);return f.get(t)},fetchDailyPost:function(){return f.get(l["a"].BIYING_SEVERN_DAY)},fetchDailyEnglish:function(){return f.get(l["a"].ENGLIST_DAILY_POST)},PostUserLogin:function(e){return f.post(l["a"].USER_LOGIN,e)},PostUserRegist:function(e){return f.post(l["a"].USER_REGIST,e)},fetchUserInfoAll:function(){return f.get(l["a"].GET_USER_INFO_ALL)},fetchSpiderDate:function(e){return f.get(l["a"].SPIDER_NEW_DATA+"?id=".concat(e))},fetchAllUserInfo:function(e){return f.get(Object(g["h"])(l["a"].GET_ALL_USER_INFO,e))},deleteUserInfo:function(e){return f.get(l["a"].DELETE_USER_INFO+"?id="+e)},updateUserInfo:function(e){return f.post(l["a"].UPDATE_USER_INFO,e)},addUserInfo:function(e){return f.post(l["a"].ADD_USER_INFO,e)},fetchSystemLog:function(){return f.get(l["a"].GET_SYSTEM_LOG)},fetchIamgeInfo:function(e){return f.get(Object(g["h"])(l["a"].GET_IMAGES_INFO,e))},deleteImageInfo:function(e){return f.get(Object(g["h"])(l["a"].DELETE_IMAGE_INFO,e))},fetchServerConfig:function(){return f.get(l["a"].GET_SERVER_CONFIG)},saveServerConfig:function(e){return f.post(l["a"].UPDATE_SERVER_CONFIG,e)},restartServer:function(){return f.get(l["a"].RESTART_SERVER)},shutdownServer:function(){return f.get(l["a"].SHUTDOWN_SERVER)},forwardRequest:function(e){return f.get(l["a"].FORWRAD_REQUEST+"?url=".concat(e))}};t["a"]=d},c98c:function(e,t,n){},fb76:function(e,t,n){}});
//# sourceMappingURL=app.e40ed438.js.map