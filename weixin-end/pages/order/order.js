// pages/order/order.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    path:'',
    defaultImg:'/images/defaultImg.jpg'
  },

  toComment: function(e) {
    var index = e.currentTarget.dataset.index;
    var orderMap = JSON.stringify(this.data.orderList[index]);
    if (this.data.orderList[index].state == '订单已完成' ) {
      wx.navigateTo({
        url: '/pages/checkComment/checkComment?orderMap=' + orderMap,
      })
    } else {
      wx.navigateTo({
        url: '/pages/comment/comment?orderMap=' + orderMap,
      })
    }
  },

  helper: function (args) {
    var that = this;
    var header = {
      'content-type': 'application/json',
      'Accept': 'application/json',
      'cookie': wx.getStorageSync("sessionid")
    };
    wx.request({
      url: args.url,
      method: "POST",
      header: header,
      data: args.data,
      success(res) {
        var cookie = res.header["Set-Cookie"];
        if (cookie != null) {
          wx.setStorageSync("sessionid", res.header["Set-Cookie"]);
        }
        if (args.success) args.success(res);
      },
      complete(res) {
        if (args.complete) args.complete(res);
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var username = getApp().globalData.username;
    var path = getApp().globalData.urlpath + '/media/';
    that.helper({
      url: getApp().globalData.urlpath + '/getOrder',
      data: {
        username: username,
      },
      success: function (res) {
        that.setData({
          orderList: res.data,
          path: path
        })
        console.log(res.data)
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
    var that = this;
    var username = getApp().globalData.username;
    var path = getApp().globalData.urlpath + '/media/'
    that.helper({
      url: getApp().globalData.urlpath + '/getOrder',
      data: {
        username: username,
      },
      success: function (res) {
        that.setData({
          orderList: res.data,
          path: path
        })
        console.log(res.data)
      }
    })
    
    
    // const db = wx.cloud.database();
    // db.collection('order').where({
    //   _openid: getApp().globalData.openid
    // }).get({
    //   success(res) {
    //     that.setData({
    //       orderList: res.data
    //     })
    //     console.log(res.data)
    //   }
    // })
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
    wx.startPullDownRefresh();
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.onLoad();
    wx.showToast({
      title: 'loading....',
      icon: 'loading',
      duration: 1200
    });
    wx.hideNavigationBarLoading(); //完成停止加载
    wx.stopPullDownRefresh(); //停止下拉刷新
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