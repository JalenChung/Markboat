import "./chunk-CSAU5B4Q.js";

// ../../../../Users/果果芒/tutou/projects/markboat/node_modules/markdown-it-toc-done-right/dist/markdownItTocDoneRight.mjs
function e(e2) {
  return encodeURIComponent(String(e2).trim().toLowerCase().replace(/\s+/g, "-"));
}
function n(e2) {
  return String(e2).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function markdownItTocDoneRight_default(r, t) {
  var l;
  t = Object.assign({}, { placeholder: "(\\$\\{toc\\}|\\[\\[?_?toc_?\\]?\\]|\\$\\<toc(\\{[^}]*\\})\\>)", slugify: e, uniqueSlugStartIndex: 1, containerClass: "table-of-contents", containerId: void 0, listClass: void 0, itemClass: void 0, linkClass: void 0, level: 1, listType: "ol", format: void 0, callback: void 0 }, t);
  var i = new RegExp("^" + t.placeholder + "$", "i");
  r.renderer.rules.tocOpen = function(e2, r2) {
    var l2 = Object.assign({}, t);
    return e2 && r2 >= 0 && (l2 = Object.assign(l2, e2[r2].inlineOptions)), "<nav" + (l2.containerId ? ' id="' + n(l2.containerId) + '"' : "") + ' class="' + n(l2.containerClass) + '">';
  }, r.renderer.rules.tocClose = function() {
    return "</nav>";
  }, r.renderer.rules.tocBody = function(e2, r2) {
    var i2 = Object.assign({}, t);
    e2 && r2 >= 0 && (i2 = Object.assign(i2, e2[r2].inlineOptions));
    var s, a = {}, c = Array.isArray(i2.level) ? (s = i2.level, function(e3) {
      return s.includes(e3);
    }) : /* @__PURE__ */ function(e3) {
      return function(n2) {
        return n2 >= e3;
      };
    }(i2.level);
    return function e3(r3) {
      var l2 = i2.listClass ? ' class="' + n(i2.listClass) + '"' : "", s2 = i2.itemClass ? ' class="' + n(i2.itemClass) + '"' : "", o = i2.linkClass ? ' class="' + n(i2.linkClass) + '"' : "";
      if (0 === r3.c.length)
        return "";
      var u = "";
      return (0 === r3.l || c(r3.l)) && (u += "<" + (n(i2.listType) + l2) + ">"), r3.c.forEach(function(r4) {
        c(r4.l) ? u += "<li" + s2 + "><a" + o + ' href="#' + function(e4) {
          for (var n2 = e4, r5 = i2.uniqueSlugStartIndex; Object.prototype.hasOwnProperty.call(a, n2); )
            n2 = e4 + "-" + r5++;
          return a[n2] = true, n2;
        }(t.slugify(r4.n)) + '">' + ("function" == typeof i2.format ? i2.format(r4.n, n) : n(r4.n)) + "</a>" + e3(r4) + "</li>" : u += e3(r4);
      }), (0 === r3.l || c(r3.l)) && (u += "</" + n(i2.listType) + ">"), u;
    }(l);
  }, r.core.ruler.push("generateTocAst", function(e2) {
    l = function(e3) {
      for (var n2 = { l: 0, n: "", c: [] }, r2 = [n2], t2 = 0, l2 = e3.length; t2 < l2; t2++) {
        var i2 = e3[t2];
        if ("heading_open" === i2.type) {
          var s = e3[t2 + 1].children.filter(function(e4) {
            return "text" === e4.type || "code_inline" === e4.type;
          }).reduce(function(e4, n3) {
            return e4 + n3.content;
          }, ""), a = { l: parseInt(i2.tag.substr(1), 10), n: s, c: [] };
          if (a.l > r2[0].l)
            r2[0].c.push(a), r2.unshift(a);
          else if (a.l === r2[0].l)
            r2[1].c.push(a), r2[0] = a;
          else {
            for (; a.l <= r2[0].l; )
              r2.shift();
            r2[0].c.push(a), r2.unshift(a);
          }
        }
      }
      return n2;
    }(e2.tokens), "function" == typeof t.callback && t.callback(r.renderer.rules.tocOpen() + r.renderer.rules.tocBody() + r.renderer.rules.tocClose(), l);
  }), r.block.ruler.before("heading", "toc", function(e2, n2, r2, t2) {
    var l2, s = e2.src.slice(e2.bMarks[n2] + e2.tShift[n2], e2.eMarks[n2]).split(" ")[0];
    if (!i.test(s))
      return false;
    if (t2)
      return true;
    var a = i.exec(s), c = {};
    if (null !== a && 3 === a.length)
      try {
        c = JSON.parse(a[2]);
      } catch (e3) {
      }
    return e2.line = n2 + 1, (l2 = e2.push("tocOpen", "nav", 1)).markup = "", l2.map = [n2, e2.line], l2.inlineOptions = c, (l2 = e2.push("tocBody", "", 0)).markup = "", l2.map = [n2, e2.line], l2.inlineOptions = c, l2.children = [], (l2 = e2.push("tocClose", "nav", -1)).markup = "", true;
  }, { alt: ["paragraph", "reference", "blockquote"] });
}
export {
  markdownItTocDoneRight_default as default
};
//# sourceMappingURL=markdown-it-toc-done-right.js.map
