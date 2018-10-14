
//获取应用实例
var common = require('../template/getCode.js')
var Bmob = require("../../utils/bmob.js");
var app = getApp()
var that;
Page({
  data: {
    newList: [],
    limit: 12,
    windowHeight: 0,
    windowWidth: 0
  },
  toSeeDetail: function (e) {
    console.log(e);
    var id = e.target.dataset.wid;
    wx.redirectTo({
      url: '/pages/listDetail/listDetail?moodId=' + id
    })
  },

  onLoad: function (options) {
    var that =this;
       var my_username = wx.getStorageSync('my_username');
        var open_id = wx.getStorageSync('user_openid');
        console.log('user_id',open_id);
        var user = Bmob.User.logIn(my_username, open_id, {
          success: function (users) {
            users.set('newsnum', wx.getStorageSync("newsnum"));
            users.save(null, {
              success: function (user) {
              },
              error: function (error) {
                console.log(error)
              }
            });
          }
        });
    this.setData({
      loading: true
    })

    var user_id = wx.getStorageSync('user_id')

    var Comments = Bmob.Object.extend("Comments");
    var query = new Bmob.Query(Comments);


    var myname = wx.getStorageSync('my_nick')
    query.equalTo("olderUserName", myname);
    query.descending('createdAt');
    query.find({
      success:function(result1){
        for (var i = 0; i < result1.length; i++) {
          result1[i].set('behavior',3);
        }
        var query1 = new Bmob.Query(Comments);
        query1.equalTo('fid',user_id)
        query1.descending('createdAt');
        query1.find({
          success:function(result2){
            for(var i = 0;i<result2.length;i++){
              if(!result2[i].olderUserName&&result2.username!=myname){
                result1[result1.length] = result2[i]
              }
            }

          //result1.sort(that.compare('createdAt'))
    
          that.setData({
            newList: result1
          })
          }
        })
      
      }
    })
  },

  compare:function(property){
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },


  clear_arr_trim:function(array) {
    for(var i = 0 ; i<array.length;i++)
{
  if (array[i] == "" || typeof (array[i]) == "undefined") {
    array.splice(i, 1);
    i = i - 1;
  }
}
return array;
},


  onReady: function () {

  },
  onShow: function () {
    this.onLoad();
  },



  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }

})
