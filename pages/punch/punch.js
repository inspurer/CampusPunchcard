var app = getApp();
var date;
var Bmob = require('../../utils/bmob.js');
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
   
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
                  wx.showToast({
                    title: '签到成功！\n签到时间:'+time,
                    icon: 'success'
                  })
                  punch.set('nickname', me);
                  punch.set('user_id', user_id);
                  punch.set('date', date);
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
                else{
                  wx.showToast({
                    title: '您已重复签到，请明天再来',
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
  
  onLoad: function () {

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
 
  },
 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
 
  }
})
 
 