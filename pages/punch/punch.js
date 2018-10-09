var app = getApp();
var calendarSignData;
var date;
var calendarSignDay;
var is_qd;
var Bmob = require('../../utils/bmob.js');
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    qdView: false,
    calendarSignData: "",
    calendarSignDay: "",
    is_qd: false,
  },
  quxiaoQd: function (e) {
    var that = this;
    that.setData({
      qdView: false,
      is_qd: true
    })
  },
  //事件处理函数
  calendarSign: function (e) {
    var that = this;
    that.setData({
      qdView: true
    })
    calendarSignData[date] = date;
    console.log(calendarSignData);
    calendarSignDay = calendarSignDay + 1;
    var today = new Date().getDate()
   
    wx.setStorageSync("calendarSignData", calendarSignData);
    wx.setStorageSync("calendarSignDay", calendarSignDay);
 
    this.setData({
      calendarSignData: calendarSignData,
      calendarSignDay: calendarSignDay
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    var mydate = new Date();
    var year = mydate.getFullYear();
    var month = mydate.getMonth() + 1;
    date = mydate.getDate();
    console.log("date" + date)
    var day = mydate.getDay();
    console.log(day)
    var nbsp = 7 - ((date - day) % 7);
    console.log("nbsp" + nbsp);
    var monthDaySize;
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31;
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30;
    } else if (month == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29;
      } else {
        monthDaySize = 28;
      }
    };

    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        console.log('1',111);
        var user_id = new Bmob.User();
        user_id.id = res.data;
        wx.getStorage({
          key: 'my_nick',
          success: function (ress) {
            console.log('2',222)
            var Punch = Bmob.Object.extend("punch");
            var punch = new Punch();
            var me = ress.data;
            var Diary = Bmob.Object.extend("punch");
            var query = new Bmob.Query(Diary);
            query.equalTo("nickname", me);
            // 查询所有数据
            query.find({
              success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
              },
              error: function (error) {
              console.log("查询失败: " + error.code + " " + error.message);
            
               punch.set('nickname', me);
               punch.set('user_id', user_id);
               console.log(me,user_id);
               punch.save(null, {
               success: function (result) { 
               console.log('success');
              },
              error: function(result,error){
                console.log(result,error,"failure")
              }
            })
          }
        });
          }
        })

      },
    })
 
 
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync("calendarSignData")
    wx.removeStorageSync("calendarSignDay")
  },
 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
 
  },
 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
 
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
 
  }
})
 
 