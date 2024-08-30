"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (DropdownItem + Dropdown + common_vendor.unref(towxml) + FileDropZone)();
}
const Dropdown = () => "../../components/dropdown/index.js";
const DropdownItem = () => "../../components/dropdown-item/index.js";
const FileDropZone = () => "../../components/FileDropZone/index.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    let towxml2 = null;
    let platform = common_vendor.ref("");
    let catalogWidth = 200;
    let catalogShow = common_vendor.ref(true);
    let catalog = common_vendor.ref(null);
    let slashShow = common_vendor.ref("display: none;");
    let catalogStyle = common_vendor.ref({
      width: catalogWidth + "px",
      display: "block"
    });
    let cataActive = false, xOffset = 0, initialX;
    function dragStart(e) {
      initialX = e.clientX - xOffset;
      cataActive = true;
    }
    function dragEnd(e) {
      initialX = null;
      cataActive = false;
    }
    function drag(e) {
      if (cataActive) {
        e.preventDefault();
        var currentX = e.clientX - initialX;
        xOffset = currentX;
        catalogStyle.value.width = catalogWidth + currentX + "px";
      }
    }
    function catalogController() {
      let windowWidth = common_vendor.index.windowWidth;
      catalogShow.value = !catalogShow.value;
      if (windowWidth > 1e3) {
        if (catalogShow.value) {
          catalogStyle.value.display = "block";
        } else {
          catalogStyle.value.display = "none";
        }
      }
      slashShow.value = catalogShow.value ? "display: none;" : "display: block;";
    }
    let dropdownOpen = common_vendor.ref(false);
    let activeDropdownName = "";
    let dropdownOpenFn = (e) => {
      var _a, _b;
      if (platform.value == "h5") {
        if (e.target.dataset.nodeType == "dropdown") {
          dropdownOpen.value = !dropdownOpen.value;
        } else {
          dropdownOpen.value = false;
        }
      }
      if (platform.value != "h5") {
        let id = (_b = (_a = e.target.dataset) == null ? void 0 : _a.id) == null ? void 0 : _b.split("-");
        if (id) {
          let type = id[0];
          let name = id[1];
          if (type == "dropdown") {
            if (activeDropdownName == name) {
              dropdownOpen.value = !dropdownOpen.value;
            } else {
              dropdownOpen.value = true;
              activeDropdownName = name;
            }
          } else {
            dropdownOpen.value = false;
          }
        } else {
          dropdownOpen.value = false;
        }
      }
      e.stopPropagation();
    };
    let activeDropdown = common_vendor.ref(null);
    let dropdownSelect = (e) => {
      let lastChange = e.target.dataset.nodename;
      if (lastChange) {
        activeDropdown.value = lastChange;
      }
    };
    let dropdownTouchend = (e) => {
      activeDropdown.value = e.currentTarget.dataset.id.split("-")[1];
    };
    let displayMode = common_vendor.ref(1);
    let mdParser = common_vendor.ref(null);
    let htmlParser = common_vendor.ref(null);
    let mdContent = common_vendor.ref(null);
    let catalogContent = common_vendor.ref(null);
    common_vendor.ref(null);
    let htmlContent = common_vendor.ref(null);
    let wxmlContent = common_vendor.ref(null);
    common_vendor.ref({
      type: "",
      name: "",
      content: ""
    });
    let domIdArr = [];
    function extractIds(htmlString) {
      const idPattern = /id=["']([^"']+)["']/g;
      let ids = [];
      let match;
      while ((match = idPattern.exec(htmlString)) !== null) {
        ids.push(match[1]);
      }
      return ids;
    }
    function mdInput() {
      let res = mdParser.value.render(mdContent.value);
      htmlContent.value = res;
      domIdArr = extractIds(res);
      if (platform.value != "h5") {
        wxmlContent.value = towxml2(htmlContent.value, "html", {
          // base: 'https://xxx.com',				// 相对资源的base路径
          theme: "dark",
          // 主题，默认`light`
          events: {
            // 为元素绑定的事件方法
            tap: (e) => {
              let id = e.currentTarget.id;
              let content = res.split('id="' + id)[1].split("<")[0].split(">")[1];
              console.log(content);
            }
          }
        });
      }
    }
    function htmlInput(mutationsList, observer) {
      let newHtmlContent = document.getElementById("htmlContentBox").innerHTML;
      mdContent.value = htmlParser.value.turndown("" + newHtmlContent);
    }
    let popupShow = common_vendor.ref(false);
    function chooseFile() {
      common_vendor.index.chooseFile({
        success: (res) => {
          let file = res.tempFiles[0];
          readFile(file);
        }
      });
    }
    function ondrop(e) {
      const file = e.files[0];
      readFile(file);
    }
    function readFile(file) {
      if (file) {
        console.log(file);
        parsedFile.value.name = file.name;
        parsedFile.value.type = getFileExtension(file.name);
        const reader = new FileReader();
        reader.onload = function(e) {
          parsedFile.value.content = e.target.result;
        };
        reader.readAsText(file);
      }
    }
    function getFileExtension(filename) {
      const parts = filename.split(".");
      return parts.length > 1 ? parts.pop().toLowerCase() : "";
    }
    function closePop() {
      popupShow.value = false;
    }
    function confirm() {
      switch (parsedFile.value.type) {
        case "md":
          mdContent.value = parsedFile.value.content;
          htmlContent.value = mdParser.value.render(mdContent.value);
          break;
        case "html":
          mdContent.value = htmlParser.value.turndown("" + parsedFile.value.content);
          htmlContent.value = mdParser.value.render(mdContent.value);
          break;
        default:
          mdContent.value = "暂不支持此类型文件！";
          break;
      }
      slashShow.value = "display: block;";
      catalogShow.value = false;
      closePop();
    }
    let showSwitcher = common_vendor.ref(false);
    function createDomId(tagName) {
      let id = "";
      let idArr = domIdArr.filter((e) => e.includes(tagName));
      for (let i = 0; i < idArr.length + 1; i++) {
        let n = i + 1;
        id = tagName + "-" + n;
        if (idArr.indexOf(id) == -1) {
          domIdArr.push(id);
          return id;
        }
      }
    }
    common_vendor.onBeforeMount(() => {
      platform.value = "mp-weixin";
      if (platform.value != "h5") {
        towxml2 = require("../../wxcomponents/towxml/index.js");
      }
      mdParser.value = new common_vendor.MarkdownIt({
        html: false,
        xhtmlOut: true,
        typographer: true
      }).use(common_vendor.p, {
        // permalink: true,
        // permalinkBefore: true,
        // permalinkSymbol: '§'
      }).use(common_vendor.toc, {
        listType: "ul",
        callback: (html, ast) => {
          let htmlString = html;
          catalogContent.value = htmlString;
          return htmlString;
        }
      });
      htmlParser.value = new common_vendor.TurndownService({ headingStyle: "atx" });
      htmlParser.value.addRule("cleanHeadAndScript", {
        filter: function(node, options) {
          return node.nodeName === "SCRIPT" || node.nodeName === "TITLE" || node.nodeName === "STYLE";
        },
        replacement: function(content) {
          return "";
        }
      });
      let oldId = null;
      let id = null;
      mdParser.value.core.ruler.push("add_attributes", function(state) {
        state.tokens.forEach((token) => {
          if (!token.attrs && !token.tag.includes("h") && token.nesting == 1 && token.tag) {
            let oldIdIndex = domIdArr.indexOf(oldId);
            if (oldIdIndex > -1) {
              domIdArr.splice(oldIdIndex, 1);
            }
            id = createDomId(token.tag);
            token.attrPush(["id", id]);
            oldId = id;
          }
          if (token.nesting == 1) {
            token.attrPush(["style", "position: relative;"]);
            token.tag;
          }
        });
        console.log("================================");
      });
      common_vendor.index.getSystemInfo({
        success: (res) => {
          common_vendor.index.windowWidth = res.windowWidth;
          common_vendor.index.windowHeight = res.windowHeight;
        }
      });
      if (common_vendor.index.windowWidth > 480) {
        document.addEventListener("mouseup", dragEnd, false);
        document.addEventListener("mousemove", drag, false);
        showSwitcher.value = false;
      } else {
        showSwitcher.value = true;
      }
    });
    common_vendor.onMounted(() => {
      if (platform.value == "h5") {
        var targetNode = document.getElementById("htmlContentBox");
        var config = { characterData: true, subtree: true };
        var observer = new MutationObserver(htmlInput);
        observer.observe(targetNode, config);
      }
    });
    function testFn(e) {
      console.log(catalog.value);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => common_vendor.isRef(popupShow) ? popupShow.value = true : popupShow = true),
        b: common_vendor.o(common_vendor.unref(dropdownTouchend)),
        c: common_vendor.p$1({
          navText: "文件(F)",
          isOpen: common_vendor.unref(dropdownOpen),
          nodeName: "F",
          active: common_vendor.unref(activeDropdown) == "F"
        }),
        d: common_vendor.o(common_vendor.unref(dropdownTouchend)),
        e: common_vendor.p$1({
          navText: "文件(T)",
          isOpen: common_vendor.unref(dropdownOpen),
          nodeName: "T",
          active: common_vendor.unref(activeDropdown) == "T"
        }),
        f: common_vendor.o((...args) => common_vendor.unref(dropdownSelect) && common_vendor.unref(dropdownSelect)(...args)),
        g: common_vendor.unref(catalogContent),
        h: common_vendor.o(dragStart),
        i: common_vendor.s(common_vendor.unref(catalogStyle)),
        j: common_vendor.unref(catalogShow) ? 1 : "",
        k: common_vendor.o([($event) => common_vendor.isRef(mdContent) ? mdContent.value = $event.detail.value : mdContent = $event.detail.value, mdInput]),
        l: common_vendor.unref(mdContent),
        m: common_vendor.unref(platform) == "h5"
      }, common_vendor.unref(platform) == "h5" ? {
        n: common_vendor.unref(htmlContent)
      } : {}, {
        o: common_vendor.unref(platform) != "h5"
      }, common_vendor.unref(platform) != "h5" ? {
        p: common_vendor.p$1({
          nodes: common_vendor.unref(wxmlContent)
        })
      } : {}, {
        q: common_vendor.unref(displayMode) == "2" ? 1 : "",
        r: common_vendor.s(common_vendor.unref(slashShow)),
        s: common_vendor.o(catalogController),
        t: common_vendor.o(testFn),
        v: common_vendor.unref(showSwitcher)
      }, common_vendor.unref(showSwitcher) ? {
        w: common_vendor.o(($event) => common_vendor.isRef(displayMode) ? displayMode.value = common_vendor.unref(displayMode) == "1" ? "2" : "1" : displayMode = common_vendor.unref(displayMode) == "1" ? "2" : "1"),
        x: common_vendor.n(common_vendor.unref(displayMode) == "1" ? "show-md" : "show-html")
      } : {}, {
        y: common_vendor.o(closePop),
        z: common_vendor.o(ondrop),
        A: common_vendor.o(chooseFile),
        B: common_vendor.p$1({
          mode: common_vendor.unref(platform)
        }),
        C: common_vendor.o(confirm),
        D: common_vendor.o(closePop),
        E: common_vendor.n(common_vendor.unref(popupShow) ? "popup-show" : ""),
        F: common_vendor.o((...args) => common_vendor.unref(dropdownOpenFn) && common_vendor.unref(dropdownOpenFn)(...args)),
        G: common_vendor.o((...args) => common_vendor.unref(dropdownOpenFn) && common_vendor.unref(dropdownOpenFn)(...args))
      });
    };
  }
};
wx.createPage(_sfc_main);
