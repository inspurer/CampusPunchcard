// pages/leftSwiperDel/index.js
var Bmob = require('../../utils/bmob.js');
Page({
  data: {
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.tempData();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh:function(){
    this.tempData();
    wx.stopPullDownRefresh();
  },



  
  tempData: function () {
    var that = this;
    var Punch = Bmob.Object.extend("punch");
    var query = new Bmob.Query(Punch);
    var mydate = new Date();
    var year = mydate.getFullYear();
    var month = mydate.getMonth() + 1;
    var day = mydate.getDate();
    var date = year + "年" + month + "月" + day + "日";
    query.equalTo("date", date);
    var results = [];
    query.find({
      success: function (result) {
        for (var i = 0; i < result.length; i++) {
          console.log('totlerr', result.length)
          var object = result[i];
          object.set('time', object.createdAt.substring(11, 19));
          object.set('rank', i + 1);
          results[i] = object;
        }
        console.log(results);
        that.setData({
          list: results
        });
      }
    })

  }

})