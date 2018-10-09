// pages/leftSwiperDel/index.js
Page({
  data: {
    delBtnWidth: 180//删除按钮宽度单位（rpx）
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.initEleWidth();
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

  getUserInfo: function () {  //获取用户信息和运动步数以及产品信息
    let that = this;
    wx.login({
      success(res) {
        console.log(res.code, 'code------------')
        wx.getUserInfo({
          success(res2) {  //在这边调用登录接口，获取用户的id
            //console.log(res2,'用户信息')
            that.setData({
              userInfo: res2.userInfo
            });
            app.globalData.userInfo = res2.userInfo;
            wx.request({
              url: app.globalData.baseUrl + 'login.php?code=' + res.code + '&nickName=' + res2.userInfo.nickName + '&avatarUrl=' + res2.userInfo.avatarUrl,
              success(res3) {
                console.log(res3, '++++++登录接口返回的信息')
                if (Number(res3.data.succeed) === 1) {
                  app.globalData.uid = res3.data.data.userId;
                }
                wx.getWeRunData({//获取运动步数
                  success(res4) {
                    console.log(res4, '=====获取用户步数,授权成功')
                    wx.request({
                      url: app.globalData.baseUrl + 'decrypt.php?encryptedData=' + res4.encryptedData + '&iv=' + res4.iv + '&userId=' + app.globalData.uid,
                      success(res) {
                        console.log(res, '后端返回的用户步数数据')
                      }
                    })
                  },
                  fail(res5) {  //授权微信运动步数失败
                    console.log(res5, '获取用户步数，授权失败')
                    that.setData({
                      authorizeMsg: '该小程序需要授权微信步数才能使用',
                      isAuthorize: true,
                      isOpensetting: true
                    })
                  }
                })
              }
            });

          }
        })
      }
    })
  },

  onLoad: function () {  //在onload进行数据的获取
    let that = this;
    wx.getSetting({ //判断用户是否授权
      success: res => {
        //console.log(res,'——————————————判断用户是否授权');
        if (res.authSetting['scope.userInfo']) {  //用户有授权,直接调用函数进行登录         
          this.getUserInfo();
        } else {  //用户未授权，弹窗引导用户授权
          console.log('用户未授权')
          this.setData({
            authorizeMsg: '该小程序需要授权用户信息才能使用',
            isAuthorize: true,
            isOpensetting: false
          })
        }
      }
    })
  },
  closeAuthorize: function () { //关闭弹窗
    console.log('res')
    this.setData({
      isAuthorize: false
    })
  },
  onGotUserInfo: function (e) { //button授权按钮事件 
    console.log(e.detail.errMsg)
    if (e.detail.errMsg === 'getUserInfo:ok') { //授权成功
      this.getUserInfo();
    } else {  //授权失败
      this.setData({
        authorizeMsg: '该小程序需要授权用户信息才能使用',
        isAuthorize: true,
        isOpensetting: false
      })
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  //测试临时数据
  tempData: function () {
    var list = [
      {
        rank: "1",
        txtStyle: "",
        name: "肖涛",
        pace: "23456",


      },
      {
        rank: "2",
        txtStyle: "",
        name: "唐霖峰",
        pace: "23450",

      },
     ]



    //
    this.setData({
      list: list
    });
  }

})