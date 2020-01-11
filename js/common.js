var base = "http://192.168.0.102:8080/sipimo";
base = "";
var ajaxLoding = 0;
// if (!(window.location.href.indexOf("register") > -1 || window.location.href.indexOf("login") > -1)) {
//   if (
//     getCookie("phoneNumber") == "undefined" ||
//     getCookie("phoneNumber") == null
//   ) {
//     location.href = "login.html";
//   }
// }

function getQueryString(e) {
  var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)");
  var a = window.location.search.substr(1).match(t);
  if (a != null) return a[2];
  return "";
}

function addCookie(e, t, a) {
  var n = e + "=" + escape(t) + "; path=/";
  if (a > 0) {
    var r = new Date();
    r.setTime(r.getTime() + a * 3600 * 1e3);
    n = n + ";expires=" + r.toGMTString();
  }
  document.cookie = n;
}

function setCookie(name, value, days) {
  var exp = new Date();
  exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
  var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  document.cookie =
    name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(e) {
  var t = document.cookie;
  var a = t.split("; ");
  for (var n = 0; n < a.length; n++) {
    var r = a[n].split("=");
    if (r[0] == e) return unescape(r[1]);
  }
  return null;
}

function delCookie(e) {
  var t = new Date();
  t.setTime(t.getTime() - 1);
  var a = getCookie(e);
  if (a != null)
    document.cookie = e + "=" + a + "; path=/;expires=" + t.toGMTString();
}

function ajax_data(url, opt, basefunc) {
  $.ajax({
    url: base + url,
    data: opt.params,
    type: opt.type || "post",
    cache: false,
    dataType: "json",
    async: typeof opt.async == "boolean" ? opt.async : true,
    contentType: opt.contentType || "application/json;charset=utf-8",
    timeout: 1000 * 60 * 2,
    beforeSend: function(XMLHttpRequest) {
      ajaxLoding += 1;
      if (ajaxLoding == 1) {
        show_loading();
      }
      // XMLHttpRequest.setRequestHeader("token");
    },
    success: function(retjson) {
      basefunc(retjson);
    },
    complete: function(XMLHttpRequest, textStatus) {
      ajaxLoding -= 1;
      if (ajaxLoding == 0) {
        hide_loading();
      }
      if (textStatus == "timeout") {
        if (error_callback != null && error_callback != "") {
          tips("网络超时", 5);
        }
      }
    },
    error: function(XMLHttpRequest) {
      $('input[type="button"]').attr("disabled", false);
      $('input[type="button"]').css("filter", "none");
      hide_loading();
    }
  });
}

// 文件导入
function file_upload(url, formData, fn) {
  show_loading();
  $.ajax({
    url: base + url,
    dataType: "json",
    type: "POST",
    async: false,
    data: formData,
    processData: false, // 使数据不做处理
    contentType: false, // 不要设置Content-Type请求头
    success: function(data) {
      fn(data);
    },
    complete: function() {
      hide_loading();
    },
    error: function(response) {
      console.log(response);
      hide_loading();
    }
  });
}

function firm(title, txt, fun) {
  // 确认框
  layer.open({
    type: 1,
    title: title,
    content: txt, //这里content是一个普通的String
    btn: ["确定", "取消"],
    area: ["300px", "200px"],
    yes: function(index, layero) {
      fun();
    },
    btn2: function(index, layero) {}
  });
}

function open_frame(title, url) {
  layer.open({
    type: 2,
    title: title,
    maxmin: true,
    content: url, //这里content
    area: ["900px", "600px"],
    success: function(layero, index) {
      //在回调方法中的第2个参数“index”表示的是当前弹窗的索引。
      //通过layer.full方法将窗口放大。
      layer.full(index);
    },
    end: function() {
      Refresh();
    }
  });
}

function open_html(title, ht_id, fn, win_width) {
  var h_w = (win_width || 800) + "px";
  var h_h = ($("body").height() < 500 ? $("body").height() - 40 : "500") + "px";
  layer.open({
    type: 1,
    title: title,
    maxmin: true,
    content: $(ht_id), //这里content
    area: [h_w, h_h],
    end: function() {
      // 销毁弹出时 执行
      if (!!fn) {
        fn();
      }
    }
  });
}
// 成功 失败 错误的提示信息
function tips(text, icon) {
  layer.msg(text, {
    icon: icon, // 6 笑表情 5 哭表情
    time: 3000 //2秒关闭（如果不配置，默认是3秒）
  });
}

function show_loading() {
  $("body").mLoading("show"); //显示loading组件
}

function hide_loading() {
  $("body").mLoading("hide"); //隐藏loading组件
}

$(function() {
  // 全局
  $(document).ajaxError(function(e, xhr, settings, error) {
    //  alert(error);
    hide_loading();
  });
});

function get_local_time() {
  // 获取本地时间
  var myDate = new Date();
  var mytime =
    myDate.getFullYear() +
    "-" +
    check_time(myDate.getMonth() + 1) +
    "-" +
    check_time(myDate.getDate());
  return mytime;
}

function get_local_year() {
  var myDate = new Date();
  var mytime = myDate.getFullYear();
  return mytime;
}

function get_local_month() {
  var myDate = new Date();
  var mytime = myDate.getMonth() + 1;
  return mytime;
}

function DateMinus(date1, date2) {
  //date1:小日期   date2:大日期
  var sdate = new Date(date1);
  var now = new Date(date2);
  var days = now.getTime() - sdate.getTime();
  var day = parseInt(days / (1000 * 60 * 60 * 24));
  return day;
}

function times(unixtimestamp) {
  // 时间戳 转换 时间格式
  var unixtimestamp = new Date(unixtimestamp * 1000);
  var year = 1900 + unixtimestamp.getYear();
  var month = "0" + (unixtimestamp.getMonth() + 1);
  var date = "0" + unixtimestamp.getDate();
  var hour = "0" + unixtimestamp.getHours();
  var minute = "0" + unixtimestamp.getMinutes();
  var second = "0" + unixtimestamp.getSeconds();
  return (
    year +
    "-" +
    month.substring(month.length - 2, month.length) +
    "-" +
    date.substring(date.length - 2, date.length) +
    " " +
    hour.substring(hour.length - 2, hour.length) +
    ":" +
    minute.substring(minute.length - 2, minute.length) +
    ":" +
    second.substring(second.length - 2, second.length)
  );
}

function check_time(k) {
  //小于10  补0；
  if (k < 10) {
    k = "0" + k;
  }
  return k;
}

//导出表格
function JSONToExcelConvertor(JSONData, FileName, ShowLabel) {
  var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
  console.log(arrData);
  var excel = "<table>";
  //设置表头
  var row = "<tr>";
  for (var i = 0, l = ShowLabel.length; i < l; i++) {
    row += "<td>" + ShowLabel[i].value + "</td>";
  }
  //换行
  excel += row + "</tr>";

  //设置数据
  for (var i = 0; i < arrData.length; i++) {
    var row = "<tr>";

    for (var j = 0; j < arrData[i].length; j++) {
      var value = arrData[i][j].value === "." ? "" : arrData[i][j].value;
      row += "<td>" + value + "</td>";
    }
    excel += row + "</tr>";
  }
  excel += "</table>";
  var excelFile =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
  excelFile +=
    '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
  excelFile +=
    '<meta http-equiv="content-type" content="application/vnd.ms-excel';
  excelFile += '; charset=UTF-8">';
  excelFile += "<head>";
  excelFile += "<!--[if gte mso 9]>";
  excelFile += "<xml>";
  excelFile += "<x:ExcelWorkbook>";
  excelFile += "<x:ExcelWorksheets>";
  excelFile += "<x:ExcelWorksheet>";
  excelFile += "<x:Name>";
  excelFile += "{worksheet}";
  excelFile += "</x:Name>";
  excelFile += "<x:WorksheetOptions>";
  excelFile += "<x:DisplayGridlines/>";
  excelFile += "</x:WorksheetOptions>";
  excelFile += "</x:ExcelWorksheet>";
  excelFile += "</x:ExcelWorksheets>";
  excelFile += "</x:ExcelWorkbook>";
  excelFile += "</xml>";
  excelFile += "<![endif]-->";
  excelFile += "</head>";
  excelFile += "<body>";
  excelFile += excel;
  excelFile += "</body>";
  excelFile += "</html>";
  var uri =
    "data:application/vnd.ms-excel;charset=utf-8," +
    encodeURIComponent(excelFile);
  var link = document.createElement("a");
  link.href = uri;
  link.style = "visibility:hidden";
  link.download = FileName + ".xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function uploadFile(that) {
  var reader = new FileReader();
  var allwlmgFileSize = 2100000;
  var file = that[0].files[0];
  var imgUrlBase64;
  if(file.type.indexOf("jpg") == -1 || file.type.indexOf("JPG") == -1  ){
    tips("请上传格式为jpg的图片",5);
    that.val("");
  }else{
    if (file) {
      imgUrlBase64 = reader.readAsDataURL(file);
      reader.onload = function(e) {
        if (allwlmgFileSize != 0 && allwlmgFileSize < reader.result.length) {
          //console.log("图片要小于2M");
        }
        var data = e.target.result;
        //加载图片获取图片真实宽度和高度
        var image = new Image();
        image.src = data;
        image.onload = function() {
          var width = image.width;
          var height = image.height;
          if (width > height) {
            that
              .parent()
              .find("img")
              .attr("width", "100px");
          } else {
            that
              .parent()
              .find("img")
              .attr("height", "100px");
          }
          that
            .parent()
            .find("img")
            .attr("src", data);
        };
      };
    } else {
    }
  }
 
}

// 下拉搜素列表
function down_list(dom, url, deftext, queryParams) {
  let str = `<div class="down_list">
                  <div class="selectedValue">
                    <input type="text" class="form-control" data-id="" placeholder="${deftext}" readonly style="display:block;width:150px;"/>
                    <i class="fa fa-2x fa-angle-down"></i>
                  </div>
                  <div class="content">
                    <input
                      type="text"
                      class="search form-control"
                      style="width: 138px"
                      placeholder="输入搜素条件"
                    />
                    <ul class="child_list"></ul>
                  </div>
                </div>
              `;
  $(dom).html(str);

  function init() {
    ajax_data(
      url,
      {
        paras: JSON.stringify({
          [queryParams]: $(dom)
            .find(".search")
            .val()
        }),
        type: "post"
      },
      function(res) {
        console.log(res);
        let option = "";
        res.forEach(element => {
          option += `<li data-id="${element.id}" title="${element.name}"> ${element.name} </li>`;
        });
        $(dom)
          .find(".child_list")
          .html(option);
      }
    );
  }
  init();
  $(dom).on("click", ".selectedValue", function() {
    $(dom)
      .find(".content")
      .slideToggle();
    $(dom)
      .find(".search")
      .val("");
  });

  $(dom).on("click", "li", function() {
    $(dom)
      .find(".selectedValue input")
      .val($(this).text());
    $(dom)
      .find(".selectedValue input")
      .attr("data-id", $(this).attr("data-id"));
    $(dom)
      .find(".content")
      .slideUp();
    $(dom)
      .find(".search")
      .val("");
  });
  $(dom).on(
    "input",
    ".search",
    debounce(function() {
      init();
    }, 200)
  );
  $(window).click(function(e) {
    if (
      $.contains($(".content")[0], e.target) ||
      $.contains($(".down_list")[0], e.target)
    ) {
    } else {
      $(".content").slideUp();
    }
  });
}

function debounce(method, delay) {
  let timer = null;
  return function() {
    let self = this,
      args = arguments;
    timer && clearTimeout(timer);
    timer = setTimeout(function() {
      method.apply(self, args);
    }, delay);
  };
}
// 控制页面的按钮
window.onload = function() {
  let purviewList = getQueryString("purview").split(",");
  if (!purviewList.includes("1")) {
    $(".addBtn").remove();
  }
  if (!purviewList.includes("2")) {
    $(".deleteBtn").remove();
  }
  if (!purviewList.includes("3")) {
    $(".editBtn").remove();
    $(".submitBtn").remove();
  }
  if (!purviewList.includes("4")) {
    $(".queryBtn").remove();
    $(".detailBnt").remove();
    $(".searchList").remove();
  }
  if(!purviewList.includes("5")){
    $(".importBtn").remove()
  }
  if(!purviewList.includes("6")){
    $(".deleteBtn").remove()
  }
};
