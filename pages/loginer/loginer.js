// pages/loginer/loginer.js
var Bmob = require("../../utils/bmob.js");
var common = require("../../utils/common.js");
Bmob.initialize("78aa3163a7c94355185893342061a7f1", "09f4b80cd11c725d5519e1838c7467e8");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight);
        console.log(res.windowWidth);
      },
    })
  },

  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
         
              //调用API从本地缓存中获取数据
              try {
                var value = wx.getStorageSync('user_openid')
                if (value) {
                  console.log("value不为空")
                  wx.switchTab({
                    url: '../punch/punch',
                  })
                } else {
                  console.log("value为空")
                  wx.login({
                    success: function (res) {
                      console.log('res', res)
                      if (res.code) {
                        Bmob.User.requestOpenId(res.code, {
                          success: function (userData) {
                                var userInfo = e.detail.userInfo;
                                var nickName = userInfo.nickName;
                                var avatarUrl = userInfo.avatarUrl;
                                Bmob.User.logIn(nickName, userData.openid, {
                                  success: function (user) {
                                    try {
                                      console.log('sex'+user.get('sex'));
                                      console.log('score' + user.get('score'));
                                      wx.setStorageSync("newsnum", user.get('newsnum'))

                                      wx.setStorageSync("sex", user.get('sex'));
                                      wx.setStorageSync("score", user.get('score'));
                                      wx.setStorageSync('user_openid', user.get("userData").openid)
                                      wx.setStorageSync('user_id', user.id);
                                      wx.setStorageSync('my_nick', user.get("nickname"))
                                      wx.setStorageSync('my_username', user.get("username"))
                                      wx.setStorageSync('my_avatar', user.get("userPic"))
                                    } catch (e) {
                                    }
                                    console.log("登录成功y");
                                    wx.switchTab({
                                      url: '../punch/punch',
                                    });
                                  },
                                  error: function (user, error) {
                                    if (error.code == "101") {
                                      var user = new Bmob.User();//开始注册用户
                                      user.set("username", nickName);
                                      user.set("password", userData.openid);//因为密码必须提供，但是微信直接登录小程序是没有密码的，所以用openId作为唯一密码                   
                                      user.set("sex","男");
                                      
                                      user.set("score",0);
                                      user.setStorageSync('newsnum',0);
                                      user.set("nickname", nickName);
                                      user.set("userPic", avatarUrl);
                                      user.set("userData", userData);
                                      user.signUp(null, {
                                        success: function (results) {
                                         

                                          try {//将返回的3rd_session储存到缓存
                                            wx.setStorageSync('user_openid', results.get("userData").openid)
                                            wx.setStorageSync('user_id', results.id);
                                            wx.setStorageSync('my_username', results.get("username"));
                                            wx.setStorageSync("newsnum", results.get('newsnum'));

                                            wx.setStorageSync("score", 0);
                                            wx.setStorageSync("sex", "男");
                                            wx.setStorageSync('my_nick', results.get("nickname"));
                                            wx.setStorageSync('my_avatar', results.get("userPic")
                                            )

                                            console.log("注册成功!");
                                            wx.switchTab({
                                              url: '../punch/punch',
                                            });
                                          } catch (e) {
                                          }
                                        },
                                        error: function (userData, error) {
                                          console.log(error)
                                        }
                                      });
                                    }
                                  }
                                });


                              
                            
                          },
                         
                        });

                      }
                       else {
                        console.log('获取用户登录态失败！' + res.errMsg)
                      }
                    },
                
                  });
                }
              } catch (e) {
                console.log("登陆失败")
              }
              wx.checkSession({
                success: function () {
                },
                fail: function () {
                  //登录态过期
                  wx.login()
                }
              })
            
        }
      }
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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