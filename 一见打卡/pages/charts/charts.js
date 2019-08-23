var app = getApp();
var date;
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newList: [],
  },

  
  tempData: function () {
    var that = this;
    var Punch = Bmob.Object.extend("_User");
    var query = new Bmob.Query(Punch);
    query.descending('score');
    query.limit(100);
    var results = [];
    query.find({
      success: function (result) {
        for (var i = 0; i < result.length; i++) {
          console.log('user length:', result.length)
          var object = result[i];
          console.log('os',object.score)
          object.set('score', object.get('score'));
          object.set('rank', i + 1);
          results[i] = object;
        }
        console.log(results);
        that.setData({
          list: results
        });
      }
    })

  },
  onLoad: function () {
    this.tempData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.tempData();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function () {
    return {
      title: '快来打卡赢积分',
      imageUrl: '../../static/images/tao.png'
    }
  },
})

