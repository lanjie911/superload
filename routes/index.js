var express = require('express');
var router = express.Router();
let md5Util = require("../util/md5");
let dbUtil = require("../dao/dbdao");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * 处理登录请求
 */
router.post('/login', function (req, res, next) {

  //console.log(req.body);

  let acc = req.body.acc;
  let pwd = md5Util.md5(req.body.pwd);

  console.log("acc %s login and pwd is %s", acc, pwd);

  let qryString = "select user_id,user_acc from admin where user_acc=? and user_pwd=?";
  let qryParams = [acc, pwd];
  let callbackfunc = function (rs, fds) {
    if(rs && rs.length > 0){
      let record = rs[0];
      console.log("user id is %s",record.user_id);
      //增加session
      req.session.login_id = record.user_id
      res.json({ rs: 'LoginOK', "user_acc":record.user_acc });
      return;
    }
    res.json({ rs: 'LoginError' });
  };

  dbUtil.query(qryString, qryParams, callbackfunc);



  //res.render('index', { title: 'Express' });
});

module.exports = router;
