
//获取应用实例
var app = getApp();
var Bmob = require("../../utils/bmob.js");

var common = require('../template/getCode.js')
var that;
Page({
  onLoad: function (options) {
    // common.dataLoading("页面加载中","loading");
    that = this;

  },
  onReady: function () {
  },
  onShow: function () {
    
  },
  onHide: function () {
  },
  onUnload: function (event) {
  },
  formSubmit: function (e) {//提交建议
    if (e.detail.value.advise == "" || e.detail.value.advise == null) {
      common.dataLoading("建议不能为空", "loading");
    }
    else {
      var Advise = Bmob.Object.extend("advise");
      var advise = new Advise();
      advise.set("username", wx.getStorageSync("my_nick"))
      advise.set("advise", e.detail.value.advise);
      advise.save(null,{
        success:function(result){
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 0,
            complete: function () {
              wx.navigateBack({
                
              })
             }
          })
         
        }
      })
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})
