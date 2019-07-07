Page({

  /**
   * 页面的初始数据
   */
  data: {
    //orderMap: { comment: "", date: "2019-05-12 19:13:50", state: "订单待评论", order: [{ name: "鸡腿", numb: 1, score: 5, src: "http://img5.imgtn.bdimg.com/it/u=2554913299,220552936&fm=26&gp=0.jpg" }, { name: "麻婆豆腐", numb: 1, score: 5, src: "http://img3.imgtn.bdimg.com/it/u=485322468,3137760735&fm=26&gp=0.jpg" }]},
    orderMap: {},
    normalSrc: '/images/no_star.png',
    selectedSrc: '/images/full_star.png',
    halfSrc: '/images/half_star.png',
    score: 0,
    scores: [1, 1],
    minlength: 0,
    maxlength: 200,
    currentWordNumber: 0,
    comment: '',
    path: '',
    defaultImg: '/images/defaultImg.jpg'
  },

  // inputs: function (e) {
  //   var comment = e.detail.value;
  //   var that = this;
  //   if (comment.length >= that.data.maxlength) {
  //     wx.showToast({
  //       title: '不能继续添加了',
  //       image: '/images/warning.png'
  //     })
  //   }
  //   that.setData({
  //     currentWordNumber: comment.length,
  //     comment: comment
  //   })
  // },

  // 提交事件
  // submit_comment: function (e) {
  //   var that = this;
  //   var post = that.data.orderMap;
  //   var scores = that.data.scores;
  //   post.comment = that.data.comment;
  //   for (let i = 0; i < scores.length; i++) {
  //     post.order[i].score = scores[i];
  //   }
  //   var pages = getCurrentPages();
  //   var prePage = pages[pages.length - 2];
  //   prePage.setData({
  //     flag: true
  //   })
  //   wx.navigateBack({
  //     delta: 1
  //   })
  //   console.log('评价得分' + that.data.scores + '\n评论' + that.data.comment);
  // },

  //点击左边,半颗星
  // selectLeft: function (e) {
  //   var score = e.currentTarget.dataset.score
  //   if (this.data.score == 0.5 && e.currentTarget.dataset.score == 0.5) {
  //     score = 0;
  //   }
  //   this.data.scores[e.currentTarget.dataset.idx] = score,
  //     this.setData({
  //       scores: this.data.scores,
  //       score: score
  //     })

  // },

  //点击右边,整颗星
  // selectRight: function (e) {
  //   var score = e.currentTarget.dataset.score
  //   this.data.scores[e.currentTarget.dataset.idx] = score,
  //     this.setData({
  //       scores: this.data.scores,
  //       score: score
  //     })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var path = getApp().globalData.urlpath + '/media/';
    var orderMap = JSON.parse(options.orderMap);
    var scores = new Array(orderMap.order.length).fill(5);
    var comment = orderMap.comment;
    for(let i = 0; i < scores.length; i++) {
      scores[i] = orderMap.order[i].score;
    }
    this.setData({
      orderMap: orderMap,
      scores: scores,
      comment: comment,
      path: path
    });
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