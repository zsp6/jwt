const jwt = require('jsonwebtoken');
// 签发 jsonwebtoken
const token = jwt.sign({
  name: '张三',
  isAdmin: true
}, 'MY_GOD');
// console.log(token);
// 验证 token 是否有效
jwt.verify(token,'MY_GOD',(err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
})
