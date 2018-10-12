
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

    var that = this;

    var user_id = wx.getStorageSync('user_id')

    var Comments = Bmob.Object.extend("Comments");
    var query = new Bmob.Query(Comments);

    query.equalTo("fid", user_id);

    var myname = wx.getStorageSync('my_nick')
    // 查询所有数据
    query.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录!", results);
        // 循环处理查询到的数据
        var resultss =[];
        if(results.length == 0){
          var query1 = new Bmob.Query(Comments);
          console.log("olderUserName", myname)
          query1.equalTo("olderUserName", myname);
          query1.find({
            success: function(results1){
              console.log("共查询到 " + results1.length + " 条记录!!", results1);
              for (var i = 0; i < results1.length; i++){
                var object = results1[i];
                object.set('behavior', 3);
                resultss[i] = object;
              }
            }
          })
        }
        else{
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            if (object.get('username') != my_username) {
              if (object.get('olderUserName')) {
                console.log(object.get('olderUserName'), myname)
                if (object.get('olderUserName') == myname) {
                  object.set('behavior', 3);
                  resultss[i] = object
                }
                resultss[i] = object
              }
              else {
                resultss[i] = object
              }
            }
          }
          resultss = that.clear_arr_trim(resultss);
        }
        
        that.setData({
          newList: resultss,
             })
        console.log(that.newList)
        // var Comments = Bmob.Object.extend("Comments");
        // var query1 = new Bmob.Query(Comments);
        // query1.equalTo("fid", user_id);
        // // 查询所有数据
        // query1.find({
        //   success: function (results1) {
        //     console.log("共查询到 " + results1.length + " 条记录!!", results1);
        //     // 循环处理查询到的数据
        //     // for (var i = 0; i < results1.length; i++) {
        //     //   var object = results1[i];
        //     //   results1[i].set("newListId", 122+i);
        //     //   results1[i].newListId = 132+i;
        //     // }
        //     // var test = results + results1;
        //     // for(var i = 0; i<test.length; i++){
        //     //   console.log('key'+test[i].newListId)
        //     // }
        //     var resultsss = results1.concat(results);
        //     // for (var i = 0; i<resultsss.length; i++){
        //     //   console.log('sss' + resultsss[i].createdAt);
        //     //   resultsss[i].set("newListID",i)
        //     // }
        //     that.setData({
        //       newList: resultsss
        //     })
        //   },
        //   error: function (error) {
        //     console.log("查询失败!!: " + error.code + " " + error.message);
        //   }
        // });
      },
      error: function (error) {
        console.log("查询失败!: " + error.code + " " + error.message);
      }
    });



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
