var data = require("self").data;
var pageMod = require("page-mod");
pageMod.PageMod({
  include: "*.dirty.ru",
  contentScriptFile: data.url("d3.user.js"),
  contentScriptWhen: "ready"
});