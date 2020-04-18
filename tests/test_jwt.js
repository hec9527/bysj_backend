const jwt = require('jsonwebtoken');

const secrit = 'love U';
const payload = {
    name: '张三',
    age: 28,
    hobby: 'gy',
};

let token = jwt.sign(payload, secrit);
console.log(token);

// 修改token
token = token.replace('a', 'b');
try {
    const result = jwt.verify(token, secrit);
    console.log(result);
} catch (error) {
    console.log(error.message);
}

const decoded = jwt.decode(token);
// 返回一样的结果
console.log(decoded);
