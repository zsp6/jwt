const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/UserModel');
const MoneyModel = require('./models/MoneyModel');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'x-token');
  next();
})
// 注册一个接口
app.get('/register', (req, res) => {
  var name = req.query.username;
  var word = req.query.password;
  let user = new UserModel ({
    userName: name,
    passWord: word
  })
  user.save().then(() => {
    res.send({
      code: 0
    })
  }).catch(() => {
    res.send({
      code: -1
    })
  })
})

// 给余额加记录
app.get('/add', (req, res) => {
  var userId = req.query.userId;
  var money = req.query.money;
  new MoneyModel({
    userId,
    money
  }).save().then(() => {
    res.send({
      code: 0
    })
  }).catch(() => {
    res.send({
      code: -1
    })
  })
})
// ================================================
app.get('/login', (req, res) => {
  var userName = req.query.userName;
  var passWord = req.query.passWord;
  UserModel.find({
    userName,
    passWord
  }).then((data) => {
    if (data.length > 0) {
      // 登录成功，需要签发一个jwt
      var token = jwt.sign({
        hello: 'world',
        userId: data[0]._id
      }, 'MY_GOD');
      res.send({
        code: 0,
        data: {
          token
        }
      })
    } else {
      res.send({
        code: -1,
        msg: '用户名或者密码错误'
      })
    }
  }).catch((err) => {
    res.send({
      code: -1
    })
  })
})
app.get('/yue', (req, res) => {
  // 这个接口就是比较需要安全的接口，所以这块需要做jwt认证。
  // 我让前端主动给我传递一个请求头，名字 x-token： 值就是登录时候签发的那个jwt
  // 1.有没有传递 x-token
  if (!req.get('x-token')) {
    res.send({
      code: -1,
      msg: '无效或过期的token'
    })
    return
  }
  // 2. 有传递的话，再来做验证
  jwt.verify(req.get('x-token'), 'MY_GOD', (err, data) => {
    if (err) {
      res.send({
        code: -1,
        msg: '无效或过期的token'
      })
    } else {
      console.log(data);
      var userId = data.userId;
      MoneyModel.findOne({
        userId: userId
      }).then(data => {
        console.log(data);
        res.send({
          code: 0,
          msg: '获取成功',
          money: data.money
        })
      })
    }
  })
})
app.listen(8080);
