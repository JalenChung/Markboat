"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  props: {
    title: String,
    // 标题是一个字符串  
    mode: {
      type: String
    }
  },
  emits: ["drop"],
  setup(__props, { emit: __emit }) {
    let props = __props;
    const emit = __emit;
    function ondrop(event) {
      ondropprevent(event);
      console.log(event.dataTransfer.files);
      emit("drop", {
        //   detail: { files: event.dataTransfer.files },
        files: event.dataTransfer.files,
        currentTarget: { dataset: {} }
      });
    }
    function ondropprevent(event) {
      event.stopPropagation();
      event.preventDefault();
    }
    common_vendor.onMounted(() => {
      if (props.mode) {
        const elem = document.getElementById("file-drop-zone");
        elem.addEventListener("drop", ondrop, false);
        elem.addEventListener("dragleave", ondropprevent, false);
        elem.addEventListener("dragenter", ondropprevent, false);
        elem.addEventListener("dragover", ondropprevent, false);
      }
    });
    common_vendor.onBeforeUnmount(() => {
      if (props.mode) {
        const elem = document.getElementById("file-drop-zone");
        elem.removeEventListener("drop", ondrop);
        elem.removeEventListener("dragleave", ondropprevent);
        elem.removeEventListener("dragenter", ondropprevent);
        elem.removeEventListener("dragover", ondropprevent);
      }
    });
    return (_ctx, _cache) => {
      return {};
    };
  }
};
wx.createComponent(_sfc_main);
