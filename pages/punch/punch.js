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

  btn_click: function(e){
    wx.getStorage({
      key: 'user_id',
      success: function (res) {
        var user_id = new Bmob.User();
        user_id.id = res.data;
        wx.getStorage({
          key: 'my_nick',
          success: function (ress) {
            var mydate = new Date();
            var year = mydate.getFullYear();
            var month = mydate.getMonth() + 1;
            var day = mydate.getDate();
            var date = year + "年" + month + "月" + day + "日";
            var hour = mydate.getHours(); //获取当前小时数(0-23)
            var minute = mydate.getMinutes(); //获取当前分钟数(0-59)
            var second = mydate.getSeconds(); //获取当前秒数(0-59)
            var time = hour + "时" + minute + "分" + second + "秒";
            var avatar = wx.getStorageSync("my_avatar");
            var Punch = Bmob.Object.extend("punch");
            var punch = new Punch();
            var me = ress.data;
            var query = new Bmob.Query(Punch);
            query.equalTo("nickname", me);
            query.equalTo("date",date);
            // 查询所有数据
            query.find({
              success: function (results) {
                console.log("共查询到 " + results.length + " 条记录");
                if(results.length == 0){
                  if (hour >= 6) {
                    if (hour <= 8) {
                      var intger;
                      if(hour <= 7){
                        if (minute < 20) {
                          intger = 3;
                        }
                        else if (minute < 40) {
                          intger = 2.5;
                        }
                        else {
                          intger = 2;
                        }
                      }
                      else if(hour<=8){
                        if (minute < 20) {
                          intger = 1.5;
                        }
                        else if (minute < 40) {
                          intger = 1;
                        }
                        else {
                          intger = 0.5;
                        }
                      }
                      wx.showToast({
                        title: '打卡成功+'+intger+"分",
                        icon: 'success'
                      })
                      wx.getStorage({
                        key: 'my_username',
                        success: function (ress) {
                          if (ress.data) {
                            var my_username = ress.data;
                            wx.getStorage({
                              key: 'user_openid',
                              success: function (openid) {
                                var openid = openid.data;
                                var user = Bmob.User.logIn(my_username, openid, {
                                  success: function (users) {
                                    var score = users.get('score');
                                    score = score + intger;
                                    users.set('score', score);  
                                    users.save(null, {
                                      success: function (user) {
                                      },
                                      error: function (error) {
                                        console.log(error)
                                      }
                                    });
                                  }
                                });
                              }, function(error) {
                                console.log(error);
                              }
                            })
                          }

                        }
                      })
                      punch.set('nickname', me);
                      punch.set('user_id', user_id);
                      punch.set('date', date);
                      punch.set('avatar',avatar)
                      punch.set('time', time);
                      console.log(me, user_id);
                      punch.save(null, {
                        success: function (result) {
                          console.log('success');
                        },
                        error: function (result, error) {
                          console.log(result, error, "failure")
                        }
                      })
                    }
                    else {
                      wx.showToast({
                        title: '已过打卡时间',
                        icon: 'loading'
                      })
                    }
                  }
                  else {
                    wx.showToast({
                      title: '还没到打卡时间',
                      icon: 'loading'
                    })
                  }
                
                  
                }
                else{
                  wx.showToast({
                    title: '重复打卡',
                    icon: 'loading'
                  })
                }
              },
              error: function (error) {
               console.log("查询失败");
              }
            });
          }
        })

      },
    })
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
    query.limit(50);
    var results = [];
    query.find({
      success: function (result) {
        for (var i = 0; i < result.length; i++) {
          console.log('共有打卡记录:', result.length)
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
 
  }
})
 
 