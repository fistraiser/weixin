// pages/home/home.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    button: '搜索',
    menu: [],
    searchMenu: [],
    trolleyOrder: [],
    selected: 0,
    foodNumber: 0,
    hidden:false,
    hiddenSearch:true,
    hiddenTrolley:true,
    flag:false,
    inputValue:"",
    cost: 0,
    path:'',
    defaultImg: '/images/defaultImg.jpg',
    time: ['8', '9', '10','11','12', '13', '14','15','16','17','18','19','20','21','23','24']
  },

  setHiddenToReverse: function(e) {
    this.setData({
      hidden: true,
      hiddenSearch: false,
      hiddenTrolley: true,
      searchMenu: [],
    });
    if (this.data.inputValue.length == 0) {
      this.setData({
        button: '取消'
      })
    }
  },

  setHiddenToTrue: function(e) {
    this.setData({
      hidden: true,
      hiddenSearch: false,
      hiddenTrolley: true,
      button: '取消'
    })
    if (this.data.inputValue.length == 0) {
      this.setData({
        button: '取消'
      })
    }
  },

  input: function(e) {
    if(e.detail.value.length > 0) {
      this.setData({
        button: '搜索'
      })
    }
    this.setData({
      inputValue:e.detail.value
    })
  },

  trolley:function(e) {
    var that = this;
    if (that.data.hiddenTrolley == true) { //显示购物车
      that.setData({
        hiddenTrolley: false,
        hidden: true,
        hiddenSearch: true,
        flag: that.data.hidden,
      });
      this.animation.bottom("0rpx").height("100%").step();
      that.setData({
        cartAnimationData: this.animation.export(),
      })
    } else { //隐藏购物车
      this.animation.bottom("-100%").height("0rpx").step();
      that.setData({
        cartAnimationData: this.animation.export(),
      })
      setTimeout(function () {
        //要延时执行的代码
        that.setData({
          hidden: that.data.flag,
          hiddenSearch: !that.data.flag,
          hiddenTrolley: true,
        });
      }, 380) //延迟时间 这里是1秒
      
    }
  },

  search: function(e) {
    var srcMenu = this.data.menu;
    var retMenu = [];
    var value = this.data.inputValue;
    var that = this;
    if (that.data.button == '取消') {
      that.setData({
        hidden: false,
        hiddenSearch: true,
        hiddenTrolley: true,
        searchMenu: [],
        button: '搜索'
      })
      return;
    }
    if(value.length != 0) {
      for (let i = 1; i < srcMenu.length; i++) {
        for (let j = 0; j < srcMenu[i].menuContent.length; j++) {
          if (srcMenu[i].menuContent[j].name.search(value) != -1) {
            retMenu.push({
              name: srcMenu[i].menuContent[j].name, src: srcMenu[i].menuContent[j].src, sales: srcMenu[i].menuContent[j].sales, rating: srcMenu[i].menuContent[j].rating, numb: srcMenu[i].menuContent[j].numb, price: srcMenu[i].menuContent[j].price
            });
          }
        }
      }
      this.setData({
        searchMenu: retMenu,
        hidden: true,
        hiddenSearch: false,
        hiddenTrolley: true,
        button: '取消'
      });
      console.log(retMenu)
    }
  },

  turnMenu: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    })
  },

  mapTrolley: function (food,act) {
    var order = this.data.trolleyOrder;
    var flag = true;
    for (let i = 0; i < order.length; i++) {
      if (order[i].name == food.name) {
        if(act) {
          order[i].numb++;
          flag = false;
        } else {
          if(order[i].numb > 0) {
            order[i].numb--;
          } 
          if(order[i].numb == 0) {
            order.splice(i,1);
          }
        }
        break;
      }
    }
    if (flag && act) {
      order.push({ name: food.name, src: food.src, sales: food.sales, rating: food.rating, numb: food.numb, price: food.price});
    }
    this.setData({
      trolleyOrder: order
    })
  },

  searchAddToTrolley: function (e) {
    var info = this.data.searchMenu;
    var srcMenu = this.data.menu;
    info[e.currentTarget.dataset.index].numb++;
    var food = info[e.currentTarget.dataset.index];
    this.mapTrolley(food,1);
    var name = info[e.currentTarget.dataset.index].name;
    for(let i = 0;i < srcMenu.length;i++) {
      for(let j = 0;j < srcMenu[i].menuContent.length;j++) {
        if (srcMenu[i].menuContent[j].name == name) {
          srcMenu[i].menuContent[j].numb++;
        }
      }
    }
    this.setData({
      foodNumber: this.data.foodNumber + 1,
      searchMenu: info,
      menu: srcMenu,
      cost: this.data.cost + food.price,
    })
  },

  trolleyAdd: function(e) {
    var that = this;
    var order = that.data.trolleyOrder;
    var food = order[e.currentTarget.dataset.index];
    food.numb++;
    var selected = that.data.selected;
    if(selected > 0) {
      that.setData({
        selected: 0,
      });
      that.map(food.name, 1);
      that.setData({
        selected: selected,
      })
      that.map(food.name, 1);
    } else {
      that.setData({
        selected: 1,
      });
      that.map(food.name, 1);
      that.setData({
        selected: 0,
      })
      that.map(food.name, 1);
    }
    var searchMenu = that.data.searchMenu;
    for (let i = 0; i < searchMenu.length;i++) {
      if (searchMenu[i].name == food.name) {
        searchMenu[i].numb++;
      }
    }
    that.setData({
      trolleyOrder: order,
      foodNumber: ++that.data.foodNumber,
      searchMenu: searchMenu,
      cost: that.data.cost + food.price
    })
  },

  trolleyRemove: function (e) {
    var that = this;
    var order = that.data.trolleyOrder;
    var food = order[e.currentTarget.dataset.index];
    food.numb--;
    if(food.numb == 0) {
      order.splice(e.currentTarget.dataset.index, 1);
    }
    var selected = that.data.selected;
    if (selected > 0) {
      that.setData({
        selected: 0,
      });
      that.map(food.name, 0);
      that.setData({
        selected: selected,
      })
      that.map(food.name, 0);
    } else {
      that.setData({
        selected: 1,
      });
      that.map(food.name, 0);
      that.setData({
        selected: 0,
      })
      that.map(food.name, 0);
    }
    var searchMenu = that.data.searchMenu;
    for (let i = 0; i < searchMenu.length; i++) {
      if (searchMenu[i].name == food.name) {
        searchMenu[i].numb--;
      }
    }
    that.setData({
      trolleyOrder: order,
      foodNumber: --that.data.foodNumber,
      searchMenu: searchMenu,
      cost: that.data.cost - food.price
    })
    console.log(that.data.trolleyOrder)
  },

  addToTrolley: function (e) {
    var info = this.data.menu;
    info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb++;
    var food = info[this.data.selected].menuContent[e.currentTarget.dataset.index];
    this.mapTrolley(food, 1);
    this.map(food.name,1);
    this.setData({
      foodNumber: this.data.foodNumber + 1,
      menu: info,
      cost: this.data.cost + this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
    })
  },

  searchRemoveFromTrolley: function (e) {
    var info = this.data.searchMenu;
    var srcMenu = this.data.menu;
    var name = info[e.currentTarget.dataset.index].name;
    var food = info[e.currentTarget.dataset.index];
    this.mapTrolley(food,0);
    info[e.currentTarget.dataset.index].numb--;
    for (let i = 0; i < srcMenu.length; i++) {
      for (let j = 0; j < srcMenu[i].menuContent.length; j++) {
        if (srcMenu[i].menuContent[j].name == name) {
          srcMenu[i].menuContent[j].numb--;
        }
      }
    }
    this.setData({
      foodNumber: this.data.foodNumber - 1,
      searchMenu: info,
      menu: srcMenu,
      cost: this.data.cost - food.price,
    })
  },

  removeFromTrolley: function (e) {
    var info = this.data.menu;
    var that = this;
    if (info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb != 0) {
      info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb--;
      that.setData({
        foodNumber: this.data.foodNumber - 1,
        menu: info,
        cost: this.data.cost - this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
      })
      that.mapTrolley(info[this.data.selected].menuContent[e.currentTarget.dataset.index], 0);
      that.map(info[this.data.selected].menuContent[e.currentTarget.dataset.index].name,0);
    }
  },

  commit: function (e) {
    var username = getApp().globalData.username
    if(username.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: "/pages/admin/admin"
            });
          }
        }
      })
      return;
    }
    var order = this.data.trolleyOrder;
    var that = this;
    if (this.data.foodNumber === 0) {
      wx.showModal({
        title: '请选择需要的餐品'
      })
    } else {
      wx.showModal({
        title: '确认选好了？',
        success: function (res) {
          if (res.confirm) {
            let mydate = new Date();
            let year = mydate.getFullYear().toString();
            let month = (mydate.getMonth() + 1).toString();
            let day = mydate.getDate().toString();
            let hour = mydate.getHours().toString();
            let min = mydate.getMinutes() < 10 ? '0' + mydate.getMinutes().toString() : mydate.getMinutes().toString();
            let sec = mydate.getSeconds().toString();
            if (that.data.time.indexOf(hour) < 0) {
              wx.showToast({
                title: '未到订餐时间',
                image: '/images/error.png'
              });
              return 0;
            }
            that.helper({
              url: getApp().globalData.urlpath+'/commitOrder',
              data: {
                username: username,
                date: year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec,
                cost: that.data.cost,
                state: '订单待评价',
                comment: '',
                order },
              success (res) {
                if (res.data == 'True') {
                  wx.showToast({
                    title: '已提交',
                    icon: 'success'
                  });
                  that.setData({
                    menu: [],
                    searchMenu: [],
                    trolleyOrder: [],
                    selected: 0,
                    foodNumber: 0,
                    hidden: false,
                    hiddenSearch: true,
                    hiddenTrolley: true,
                    flag: false,
                    inputValue: "",
                    cost: 0
                  });
                  that.onLoad();
                }
              }
            })
            // const db = wx.cloud.database();
            // db.collection('order').add({
            //   data: {
            //     openid: getApp().globalData.openid,
            //     date: year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec,
            //     state:'订单待评论',
            //     comment:'',
            //     order
            //   },
            //   success(res) {
            //     console.log(res)
            //   }
            // });
            // wx.showToast({
            //   title: '已提交',
            //   icon: 'success'
            // })
          }
        }
      })
    }
  },

  map: function(name,act) {
    var that = this;
    var info = that.data.menu;
    if (that.data.selected == 0) {
      for (let i = 1; i < info.length;i++) {
        for (let j = 0; j < info[i].menuContent.length;j++) {
          if(info[i].menuContent[j].name == name) {
            if(act == 0) {
              info[i].menuContent[j].numb--;
            } else {
              info[i].menuContent[j].numb++;
            }
            break; //跳出循环
          }
        }
      }
    } else {
      for (let k = 0;k < info[0].menuContent.length;k++) {
        if (info[0].menuContent[k].name == name) {
          if (act == 0) {
            info[0].menuContent[k].numb--;
          } else {
            info[0].menuContent[k].numb++;
          }
          break; //跳出循环
        }
      }
    }
    that.setData({
      menu: info
    })
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
    //初始化menu
    var that = this;
    var username = getApp().globalData.username;
    var path = getApp().globalData.urlpath + '/media/';
    console.log(username);
    that.helper({
      url: getApp().globalData.urlpath+'/queryMenu',
      data: {
        username: username,
      },
      success: function (res) {
        that.setData({
          menu: res.data,
          path: path
        })
        console.log(res.data)
      }
    })
    this.animation = wx.createAnimation({
      duration: 400, // 整个动画过程花费的时间，单位为毫秒
      timingFunction: "ease", // 动画的类型
      delay: 0 // 动画延迟参数
    })
    // const db = wx.cloud.database();
    // db.collection('menu').get({
    //   success(res) {
    //     that.setData({
    //       menu:res.data,
    //     })
    //     console.log(res.data)
    //   }
    // })
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
    wx.startPullDownRefresh();
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.onLoad();
    wx.showToast({
      title: 'loading....',
      icon: 'loading',
      duration: 1200
    });
    wx.stopPullDownRefresh(); //停止下拉刷新
    wx.hideNavigationBarLoading(); //完成停止加载
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