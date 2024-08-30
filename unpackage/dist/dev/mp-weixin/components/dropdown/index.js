"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  props: {
    title: String,
    // 标题是一个字符串  
    navText: {
      // 消息是一个对象，具有类型和默认值  
      type: String,
      default: "xxx"
    },
    // 当isOpen和active都真，菜单才落下
    isOpen: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    nodeName: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    common_vendor.onMounted(() => {
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(__props.navText),
        b: __props.nodeName,
        c: common_vendor.n(__props.isOpen && __props.active ? "active" : "")
      };
    };
  }
};
wx.createComponent(_sfc_main);
