import './style/base.sass'
import './vendor'

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  async getUserInfo () {
    if (this.globalData.userInfo) return this.globalData.userInfo

    const { code } = await wx.loginAsync()
    const { userInfo } = await wx.getUserInfoAsync()

    this.globalData.userInfo = userInfo

    return userInfo
  },
  globalData:{
    userInfo:null
  }
})