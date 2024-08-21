var request = require('requests');
var iconv = require('iconv-lite'); //转码
var cheerio = require('cheerio'); //快速、灵活、实施的jQuery核心实现
var fs = require("fs"); // node自带的模块
var async = require("async"); // 解决异步问题

var hrefArr = [ ]
var viewInfo = [];
var requestData = function (item) {
  return new Promise(function (resolve, reject) {

    request.post({
        url:'https://zjj.sz.gov.cn/zfxx/bzflh/lhmc/getLhmcList',
        encoding:null,
        data:{
            "area":"04e871ba89aa4bb94aad612f503771bb7ca40bf00eb53f4754a4bb39d39df67a3e0817eb5a93dee033be766297cbd6e4c5f3571f38b1c56ece9cf1c06631495ff1383601a2b4f617658b892a2bf8ed0471251fd635481023f49135e0b05e4d4da2a39fc01a",
            "page": 1,
            "pageNumber": 1,
            "pageSize": 100,
            "waittype":"0437c5aed749bcbc0da18d9d0f59cf9836ec1dacb1833475c02ccb7d7fa7708010daabd1c7bd9e28cfc79fe33547317c1d02c65b3359b245fc684436b23f063410caf301eee721747a6a2b54a5c8a35817d6cdce069a82be15d6a0b7b815ec029dbb8dd8ac"
    }
    },(err,response,body)=>{
      var buf =  iconv.decode(body, 'utf-8'); // 爬取的网页是‘gb2312’格式
      var $ = cheerio.load(buf);
      var data = [];

      $("[height='22']").each(function(index, element){
        var info = $(element).text().trim();
        var splitInfo = info.split("：");
        data.push(splitInfo[1]);
      })
      var obj = {
        id: href.replace(/[^0-9]/ig,""),
        name: data[0],
        tel: data[1],
        qq: data[2],
        date: data[3],
        area: data[4],
        email: data[5],
        location: data[6],
        ip: data[7],
        phone: data[8],
      }
      viewInfo.push(obj);
      resolve(viewInfo);
    });
  })
};
(async function () {
  for(var i = 0; i < hrefArr.length; i++ ) {
    let result = await requestData(hrefArr[i]);
    console.log(result);
	fs.writeFile('export.json', JSON.stringify(result) , function(err) { // 将文件写入到expor.json中
	if (err) {
        return console.error(err);
    }
        console.log("数据写入成功！");
    });
  }
})();

