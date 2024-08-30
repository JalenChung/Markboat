import "./chunk-CSAU5B4Q.js";

// ../../../../Users/果果芒/tutou/projects/markboat/node_modules/markdown-it-anchor/dist/markdownItAnchor.mjs
var e = false;
var n = { false: "push", true: "unshift", after: "push", before: "unshift" };
var t = { isPermalinkSymbol: true };
function r(r2, a2, i2, l2) {
  var o2;
  if (!e) {
    var c2 = "Using deprecated markdown-it-anchor permalink option, see https://github.com/valeriangalliat/markdown-it-anchor#permalinks";
    "object" == typeof process && process && process.emitWarning ? process.emitWarning(c2) : console.warn(c2), e = true;
  }
  var s2 = [Object.assign(new i2.Token("link_open", "a", 1), { attrs: [].concat(a2.permalinkClass ? [["class", a2.permalinkClass]] : [], [["href", a2.permalinkHref(r2, i2)]], Object.entries(a2.permalinkAttrs(r2, i2))) }), Object.assign(new i2.Token("html_block", "", 0), { content: a2.permalinkSymbol, meta: t }), new i2.Token("link_close", "a", -1)];
  a2.permalinkSpace && i2.tokens[l2 + 1].children[n[a2.permalinkBefore]](Object.assign(new i2.Token("text", "", 0), { content: " " })), (o2 = i2.tokens[l2 + 1].children)[n[a2.permalinkBefore]].apply(o2, s2);
}
function a(e2) {
  return "#" + e2;
}
function i(e2) {
  return {};
}
var l = { class: "header-anchor", symbol: "#", renderHref: a, renderAttrs: i };
function o(e2) {
  function n2(t2) {
    return t2 = Object.assign({}, n2.defaults, t2), function(n3, r2, a2, i2) {
      return e2(n3, t2, r2, a2, i2);
    };
  }
  return n2.defaults = Object.assign({}, l), n2.renderPermalinkImpl = e2, n2;
}
var c = o(function(e2, r2, a2, i2, l2) {
  var o2, c2 = [Object.assign(new i2.Token("link_open", "a", 1), { attrs: [].concat(r2.class ? [["class", r2.class]] : [], [["href", r2.renderHref(e2, i2)]], r2.ariaHidden ? [["aria-hidden", "true"]] : [], Object.entries(r2.renderAttrs(e2, i2))) }), Object.assign(new i2.Token("html_inline", "", 0), { content: r2.symbol, meta: t }), new i2.Token("link_close", "a", -1)];
  if (r2.space) {
    var s2 = "string" == typeof r2.space ? r2.space : " ";
    i2.tokens[l2 + 1].children[n[r2.placement]](Object.assign(new i2.Token("string" == typeof r2.space ? "html_inline" : "text", "", 0), { content: s2 }));
  }
  (o2 = i2.tokens[l2 + 1].children)[n[r2.placement]].apply(o2, c2);
});
Object.assign(c.defaults, { space: true, placement: "after", ariaHidden: false });
var s = o(c.renderPermalinkImpl);
s.defaults = Object.assign({}, c.defaults, { ariaHidden: true });
var u = o(function(e2, n2, t2, r2, a2) {
  var i2 = [Object.assign(new r2.Token("link_open", "a", 1), { attrs: [].concat(n2.class ? [["class", n2.class]] : [], [["href", n2.renderHref(e2, r2)]], Object.entries(n2.renderAttrs(e2, r2))) })].concat(n2.safariReaderFix ? [new r2.Token("span_open", "span", 1)] : [], r2.tokens[a2 + 1].children, n2.safariReaderFix ? [new r2.Token("span_close", "span", -1)] : [], [new r2.Token("link_close", "a", -1)]);
  r2.tokens[a2 + 1] = Object.assign(new r2.Token("inline", "", 0), { children: i2 });
});
Object.assign(u.defaults, { safariReaderFix: false });
var d = o(function(e2, r2, a2, i2, l2) {
  var o2;
  if (!["visually-hidden", "aria-label", "aria-describedby", "aria-labelledby"].includes(r2.style))
    throw new Error("`permalink.linkAfterHeader` called with unknown style option `" + r2.style + "`");
  if (!["aria-describedby", "aria-labelledby"].includes(r2.style) && !r2.assistiveText)
    throw new Error("`permalink.linkAfterHeader` called without the `assistiveText` option in `" + r2.style + "` style");
  if ("visually-hidden" === r2.style && !r2.visuallyHiddenClass)
    throw new Error("`permalink.linkAfterHeader` called without the `visuallyHiddenClass` option in `visually-hidden` style");
  var c2 = i2.tokens[l2 + 1].children.filter(function(e3) {
    return "text" === e3.type || "code_inline" === e3.type;
  }).reduce(function(e3, n2) {
    return e3 + n2.content;
  }, ""), s2 = [], u2 = [];
  if (r2.class && u2.push(["class", r2.class]), u2.push(["href", r2.renderHref(e2, i2)]), u2.push.apply(u2, Object.entries(r2.renderAttrs(e2, i2))), "visually-hidden" === r2.style) {
    if (s2.push(Object.assign(new i2.Token("span_open", "span", 1), { attrs: [["class", r2.visuallyHiddenClass]] }), Object.assign(new i2.Token("text", "", 0), { content: r2.assistiveText(c2) }), new i2.Token("span_close", "span", -1)), r2.space) {
      var d2 = "string" == typeof r2.space ? r2.space : " ";
      s2[n[r2.placement]](Object.assign(new i2.Token("string" == typeof r2.space ? "html_inline" : "text", "", 0), { content: d2 }));
    }
    s2[n[r2.placement]](Object.assign(new i2.Token("span_open", "span", 1), { attrs: [["aria-hidden", "true"]] }), Object.assign(new i2.Token("html_inline", "", 0), { content: r2.symbol, meta: t }), new i2.Token("span_close", "span", -1));
  } else
    s2.push(Object.assign(new i2.Token("html_inline", "", 0), { content: r2.symbol, meta: t }));
  "aria-label" === r2.style ? u2.push(["aria-label", r2.assistiveText(c2)]) : ["aria-describedby", "aria-labelledby"].includes(r2.style) && u2.push([r2.style, e2]);
  var f2 = [Object.assign(new i2.Token("link_open", "a", 1), { attrs: u2 })].concat(s2, [new i2.Token("link_close", "a", -1)]);
  (o2 = i2.tokens).splice.apply(o2, [l2 + 3, 0].concat(f2)), r2.wrapper && (i2.tokens.splice(l2, 0, Object.assign(new i2.Token("html_block", "", 0), { content: r2.wrapper[0] + "\n" })), i2.tokens.splice(l2 + 3 + f2.length + 1, 0, Object.assign(new i2.Token("html_block", "", 0), { content: r2.wrapper[1] + "\n" })));
});
function f(e2, n2, t2, r2) {
  var a2 = e2, i2 = r2;
  if (t2 && Object.prototype.hasOwnProperty.call(n2, a2))
    throw new Error("User defined `id` attribute `" + e2 + "` is not unique. Please fix it in your Markdown to continue.");
  for (; Object.prototype.hasOwnProperty.call(n2, a2); )
    a2 = e2 + "-" + i2, i2 += 1;
  return n2[a2] = true, a2;
}
function p(e2, n2) {
  n2 = Object.assign({}, p.defaults, n2), e2.core.ruler.push("anchor", function(e3) {
    for (var t2, a2 = {}, i2 = e3.tokens, l2 = Array.isArray(n2.level) ? (t2 = n2.level, function(e4) {
      return t2.includes(e4);
    }) : /* @__PURE__ */ function(e4) {
      return function(n3) {
        return n3 >= e4;
      };
    }(n2.level), o2 = 0; o2 < i2.length; o2++) {
      var c2 = i2[o2];
      if ("heading_open" === c2.type && l2(Number(c2.tag.substr(1)))) {
        var s2 = n2.getTokensText(i2[o2 + 1].children), u2 = c2.attrGet("id");
        u2 = null == u2 ? f(n2.slugify(s2), a2, false, n2.uniqueSlugStartIndex) : f(u2, a2, true, n2.uniqueSlugStartIndex), c2.attrSet("id", u2), false !== n2.tabIndex && c2.attrSet("tabindex", "" + n2.tabIndex), "function" == typeof n2.permalink ? n2.permalink(u2, n2, e3, o2) : (n2.permalink || n2.renderPermalink && n2.renderPermalink !== r) && n2.renderPermalink(u2, n2, e3, o2), o2 = i2.indexOf(c2), n2.callback && n2.callback(c2, { slug: u2, title: s2 });
      }
    }
  });
}
Object.assign(d.defaults, { style: "visually-hidden", space: true, placement: "after", wrapper: null }), p.permalink = { __proto__: null, legacy: r, renderHref: a, renderAttrs: i, makePermalink: o, linkInsideHeader: c, ariaHidden: s, headerLink: u, linkAfterHeader: d }, p.defaults = { level: 1, slugify: function(e2) {
  return encodeURIComponent(String(e2).trim().toLowerCase().replace(/\s+/g, "-"));
}, uniqueSlugStartIndex: 1, tabIndex: "-1", getTokensText: function(e2) {
  return e2.filter(function(e3) {
    return ["text", "code_inline"].includes(e3.type);
  }).map(function(e3) {
    return e3.content;
  }).join("");
}, permalink: false, renderPermalink: r, permalinkClass: s.defaults.class, permalinkSpace: s.defaults.space, permalinkSymbol: "¶", permalinkBefore: "before" === s.defaults.placement, permalinkHref: s.defaults.renderHref, permalinkAttrs: s.defaults.renderAttrs }, p.default = p;
export {
  p as default
};
//# sourceMappingURL=markdown-it-anchor.js.map
