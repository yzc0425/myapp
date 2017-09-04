var express = require('express');
var router = express.Router();

// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/Usersql');

// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);

// 响应一个JSON数据 
var responseJSON = function (res, ret) { 
  if(typeof ret === 'undefined') {
     res.json({ code:'-200', msg: '操作失败' });
  } else {
     res.json(ret); 
  }
};

/* POST方法添加数据 */
router.post('/addUser',function(req, res) {
  console.log("h1");
  // 从连接池获取连接 
  pool.getConnection(function(err, connection) { 
    // 获取前台页面传过来的参数  
    connection.query(userSQL.insert, [req.body.uid,req.body.name], function(err, result) { 
      if(result) { 
        result = {
           code: 200, 
           msg:'增加成功'
           };
      }
      // 以json形式，把操作结果返回给前台页面     
      responseJSON(res, result);   
      // 释放连接 
      connection.release(); 
    });
  });
});

router.get('/query', function(req, res, next) {
  console.log("h2");
  // 从连接池获取连接 
  pool.getConnection(function(err, connection) { 
    // 获取前台页面传过来的参数  
    var param = req.query || req.params;
    connection.query("SELECT * FROM user", function(err, result) { 
      // 以json形式，把操作结果返回给前台页面     
      responseJSON(res, result);   
      // 释放连接 
      connection.release(); 
    });
  });
});

router.get('/update', function(req, res, next) {
  console.log("h6");
  // 从连接池获取连接 
  pool.getConnection(function(err, connection) { 
    // 获取前台页面传过来的参数  
    var param = req.query || req.params;
    connection.query("update user set userName = ? where uid = ?", [param.username,param.uid],function(err, result) { 
      // 以json形式，把操作结果返回给前台页面     
      responseJSON(res, result);   
      // 释放连接 
      connection.release(); 
    });
  });
});

router.get('/getbyid', function(req, res, next) {
  console.log("h3");
  // 从连接池获取连接 
  pool.getConnection(function(err, connection) { 
    // 获取前台页面传过来的参数  
    var param = req.query || req.params;
    connection.query(userSQL.getUserById,[param.uid], function(err, result) { 
      // 以json形式，把操作结果返回给前台页面     
      responseJSON(res, result);   
      // 释放连接 
      connection.release(); 
    });
  });
});

router.get('/deletebyid', function(req, res, next) {
  console.log("h5");
  // 从连接池获取连接 
  pool.getConnection(function(err, connection) { 
    // 获取前台页面传过来的参数  
    var param = req.query || req.params;
    connection.query("delete from user where uid = ?",[param.uid], function(err, result) { 
      // 以json形式，把操作结果返回给前台页面     
      responseJSON(res, result);   
      // 释放连接 
      connection.release(); 
    });
  });
});

router.all('/', function(req, res,next) {
  console.log("h4");
  res.json({yes:'right'});
});

module.exports = router;
