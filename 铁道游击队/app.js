//app.js
var Bmob=require("utils/bmob.js");
var common=require("utils/common.js");
Bmob.initialize("78aa3163a7c94355185893342061a7f1", "09f4b80cd11c725d5519e1838c7467e8");
App({
  onLaunch: function () {
   
  },
  onShow:function(){
    
  },
  globalData:{
    
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh()
  },
  onError: function(msg) {
    
  }
})