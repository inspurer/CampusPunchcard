


var countTooGetLocation = 0;
var total_micro_second = 0;
var starRun = 0;
var totalSecond  = 0;
var Bmob = require('../../utils/bmob.js');
var oriMeters = 0.0;
/* 毫秒级倒计时 */
function count_down(that) {

    if (starRun == 0) {
      return;
    }

    if (countTooGetLocation >= 100) {
      var time = date_format(total_micro_second);
      that.updateTime(time);
    }

  	if (countTooGetLocation >= 5000) { //1000为1s
        that.getLocation();
        countTooGetLocation = 0;
  	}   
    

 setTimeout
  	setTimeout(function(){
		countTooGetLocation += 10;
    total_micro_second += 10;
		count_down(that);
    }
    ,10
    )
}


// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  	// 秒数
  	var second = Math.floor(micro_second / 1000);
  	// 小时位
  	var hr = Math.floor(second / 3600);
  	// 分钟位
  	var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  	// 秒位
	var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;


	return hr + ":" + min + ":" + sec + " ";
}


function getDistance(lat1, lng1, lat2, lng2) { 
    var dis = 0;
    var radLat1 = toRadians(lat1);
    var radLat2 = toRadians(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRadians(lng1) - toRadians(lng2);
    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
    return dis * 6378137;

    function toRadians(d) {  return d * Math.PI / 180;}
} 

function fill_zero_prefix(num) {
	return num < 10 ? "0" + num : num
}

//****************************************************************************************
//****************************************************************************************

Page({
  data: {
    clock: '',
    isLocation:false,
    latitude: 0,
    longitude: 0,
    markers: [],
    covers: [],
    meters: 0.00,
    time: "0:00:00"
  },

//****************************
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.getLocation()
    console.log("onLoad")
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    count_down(this);
  },
  onShow:function(){
    wx.showToast({
      title: '请及时上传数据',
      icon: 'success'
    })
  },
  //****************************
  openLocation:function (){
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
          wx.openLocation({
            latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬
            longitude: res.longitude, // 经度，范围为-180~180，负数表示西经
            scale: 28, // 缩放比例
          })
      },
    })
  },


//****************************
  starRun :function () {
    if (starRun == 1) {
      return;
    }
    starRun = 1;
    count_down(this);
    this.getLocation();
  },


 //****************************
  stopRun:function () {
    starRun = 0;
    count_down(this);
  },

  upload:function(){
    if(oriMeters>0.5){
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
              var hour = mydate.getHours(); //获取当前小时数(0-23)
              var minute = mydate.getMinutes(); //获取当前分钟数(0-59)
              var second = mydate.getSeconds(); //获取当前秒数(0-59)
              var datetime = year + "年" + month + "月" + day + "日" + hour + "时" + minute + "分" + second + "秒";
              var Run = Bmob.Object.extend("run");
              var run = new Run();
              var me = ress.data;

              // 查询所有数据

              run.set('nickname', me);
              run.set('user_id', user_id);
              run.set('sex',wx.getStorageInfoSync("sex"));
              run.set('datetime', datetime);
              run.set('far', oriMeters);
              console.log(me, user_id);
              run.save(null, {
                success: function (result) {
                  console.log('success');
                  oriMeters = 0;
                  wx.showToast({
                    title: '上传成功',
                    icon: 'success'
                  })
                },
                error: function (result, error) {
                  console.log(result, error, "failure")
                }
              })

            }
          })

        },
      })
    }
    else{
      wx.showToast({
        title: '>0.5km后上传',
        icon: 'laoding',
      })
    }
  },


//****************************
  updateTime:function (time) {

    var data = this.data;
    data.time = time;
    this.data = data;
    this.setData ({
      time : time,
    })

  },


//****************************
  getLocation:function () {
    var that = this
    wx.getLocation({

      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
        console.log("res----------")
        console.log(res)

        //make datas 
        var newCover = {
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: '../../static/images/redPoint.png',
          };
        var oriCovers = that.data.covers;
        
        console.log("oriMeters----------")
        console.log(oriMeters);
        var len = oriCovers.length;
        var lastCover;
        if (len == 0) {
          oriCovers.push(newCover);
        }
        len = oriCovers.length;
        var lastCover = oriCovers[len-1];
        
        console.log("oriCovers----------")
        console.log(oriCovers,len);

        var newMeters = getDistance(lastCover.latitude,lastCover.longitude,res.latitude,res.longitude)/1000;
        
        if (newMeters < 0.0015){
            newMeters = 0.0;
        }

        oriMeters = oriMeters + newMeters; 
        console.log("newMeters----------")
        console.log(newMeters);


        var meters = new Number(oriMeters);
        var showMeters = meters.toFixed(2);

        oriCovers.push(newCover);
        
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [],
          covers: oriCovers,
          meters:showMeters,
        });
      },
    })
  }
  
})



