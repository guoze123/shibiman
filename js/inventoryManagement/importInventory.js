"use strict";

var allwares = ""; //所有商品

(function (document, window, $) {
  var isadd = false;
  $(".query_startTime").datepicker({
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    clearBtn: true,
    format: "yyyy-mm-dd"
  });

  function initFn() {
    queryWaresInfo();
    $("#importInventory").bootstrapTable({
      method: "post",
      url: base + "/inventory/queryEntryStock",
      //请求路径
      striped: true,
      //是否显示行间隔色
      pageNumber: 1,
      //初始化加载第一页
      pagination: true,
      //是否分页
      sidePagination: "client",
      //server:服务器端分页|client：前端分页
      pageSize: 10,
      //单页记录数
      pageList: [10, 20, 30],
      //可选择单页记录数
      showRefresh: false,
      //刷新按钮
      cache: true,
      // 禁止数据缓存
      search: false,
      // 是否展示搜索
      showLoading: true,
      height: $(window).height() - 150,
      queryParams: queryParams,
      columns: [{
        title: " 日期",
        field: "operationDate"
      }, {
        title: "订单号",
        field: "ordernum"
      }, {
        title: "应付金额",
        field: "amount"
      }, {
        title: "实付金额",
        field: "payedAmount"
      }, {
        title: "备注",
        field: "remark"
      }, {
        title: "发票",
        formatter: function formatter(value, row) {
          return "<img  class=\"viewImg\" src=\"".concat(base + "/uploadImgs/" + row.stockId + ".jpg", "\"  style=\"width:50px;height:50px\">");
        },
        events: {
          "click .viewImg": function clickViewImg(e, v, row) {
            var url = base + "/uploadImgs/" + row.stockId + ".jpg";
            var image = new Image();
            image.src = url;

            image.onload = function () {
              var width = image.width;
              var height = image.height;

              if (width > height) {
                height = 800 / width * height;
                width = 800;
              } else {
                width = 500 / height * width;
                height = 500;
              }

              layer.open({
                type: 1,
                title: false,
                closeBtn: 1,
                area: [width + "px", height + "px"],
                skin: "layui-layer-nobg",
                //没有背景色
                shadeClose: true,
                content: "<img src=\"".concat(base + "/uploadImgs/" + row.stockId + ".jpg", "\" style=\"width:").concat(width, "px; height:").concat(height, "px \"/>")
              });
            };
          }
        }
      }, {
        title: "操作",
        field: "publicationTime",
        events: operateEvents,
        formatter: operation //对资源进行操作,

      }]
    });
  }

  function operation(vlaue, row) {
    var purviewList = getQueryString("purview").split(",");
    var html = "";

    if (purviewList.includes("3")) {
      html += "<button type=\"button\" id=\"edit\" class=\"btn btn-info btn-sm editBtn\" style=\"margin-right:10px;\">\u4FEE\u6539</button> ";
    }

    if (purviewList.includes("4")) {
      html += "<button type=\"button\" id=\"detail\" class=\"btn btn-primary btn-sm detailBtn\">\u8BE6\u60C5</button>";
    }

    return html;
  }

  var operateEvents = {
    "click #edit": function clickEdit(e, v, row) {
      isadd = false;
      ajax_data("/inventory/queryEntryStockDetail", {
        params: {
          stockId: row.stockId
        },
        contentType: "application/x-www-form-urlencoded;charset=utf-8"
      }, function (res) {
        var params = {
          startTime: row.operationDate,
          // 日期
          ordernum: row.ordernum,
          //订单号
          totalAmount: row.amount,
          // 应付
          payedAmount: row.payedAmount,
          // 实付
          remark: row.remark,
          // 备注
          entryType: 0,
          stockId: row.stockId,
          waresList: res,
          fromStoreId: -1,
          toStoreId: 0
        };
        ajax_data("/inventory/modifyEntryStock", {
          params: {
            jsonStr: JSON.stringify(params)
          },
          contentType: "application/x-www-form-urlencoded;charset=utf-8"
        }, function (res) {});
        $(".startTime").val(row.operationDate); // 日期

        $(".ordernum").val(row.ordernum); //订单号

        $(".handleAmount").val(row.totalAmount); // 应付

        $(".actualAmount").val(row.payedAmount); // 实付

        $(".remark").val(row.remark); // 备注

        function allWares(selectId) {
          var option = "<option value='' data-id=''>选择商品名称</option>";

          if (allwares.length) {
            allwares.forEach(function (item, index) {
              option += "<option value=\"".concat(item.waresName, "\" data-id=\"").concat(item.waresId, "\" ").concat(item.waresId == selectId ? "selected" : "", " >").concat(item.waresName, "</option>");
            });
          }

          return option;
        }

        if (res.length == 1) {
          $(".firstGroup").find(".name").html(allWares(res[0].waresId));
          $(".firstGroup").find(".number").val(res[0].waresCount);
        }

        if (res.length > 1) {
          $(".firstGroup").find(".name").html(allWares(res[0].waresId));
          $(".firstGroup").find(".number").val(res[0].waresCount);
          var str = "";

          for (var i = 1; i < res.length; i++) {
            str += "<div class=\"list_row commodity newShop\">\n                        <div style=\"width: 100%;\">\n                        <span><i class=\"required\">*</i>\u5546\u54C1\u540D\u79F0</span>\n                        <select class=\"form-control name\">\n                        ".concat(allWares(res[i].waresId), "\n                        </select>\n                        <span style=\"margin-left: 10px;\"><i class=\"required\">*</i>\u5546\u54C1\u6570\u91CF</span>\n                        <input type=\"text\" placeholder=\"\u5546\u54C1\u6570\u91CF\" class=\"form-control number\" value=\"").concat(res[i].waresCount, "\">\n                        <button style=\" margin-left: 10px;\" onclick=\"deleteCommodity(this)\">\u5220\u9664\u5546\u54C1</button>\n                        </div></div>\n                                ");
          }

          $(".firstGroup").after(str);
        }

        open_html("修改信息", "#editData", function (params) {
          $("#editData input").val("");
          $("#editData select").val("");
          $("#editData .newShop").remove();
          $("#editData img").attr("src", "");
        }, function () {
          confirmFn();
        }, function () {
          closeFn();
        });
      });
    },
    "click #detail": function clickDetail(e, v, row) {
      ajax_data("/inventory/queryEntryStockDetail", {
        params: {
          stockId: row.stockId
        },
        contentType: "application/x-www-form-urlencoded;charset=utf-8"
      }, function (res) {
        $("#detailTable").bootstrapTable("destroy");
        $("#detailTable").bootstrapTable({
          striped: true,
          //是否显示行间隔色
          pagination: false,
          //是否分页,
          data: res,
          height: $("body").height() < 500 ? $("body").height() - 120 : 300,
          columns: [{
            title: "商品名称",
            field: "waresName"
          }, {
            title: "商品数量",
            field: "waresCount"
          }, {
            title: "是否属于赠品",
            field: "showName"
          }]
        });
        open_html("详情信息", "#entryDetail", function () {});
      });
    }
  };
  document.getElementById("importInventory").addEventListener("error", function (event) {
    var ev = event || window.event;
    var elem = ev.target;

    if (elem.tagName.toLowerCase() == "img") {
      // 图片加载失败  --替换为默认
      elem.src = "../../img/noImg.png";
      $(elem).css({
        visibility: "hidden"
      });
    }
  }, true);

  function queryParams() {
    return {
      startTime: $(".query_startTime").val().trim() ? $(".query_startTime").val().trim() : undefined,
      ordernum: $(".query_ordernum").val().trim() ? $(".query_ordernum").val().trim() : undefined
    };
  }

  $(".addBtn").click(function () {
    isadd = true;
    open_html("添加", "#editData", function (params) {
      $("#editData input").val("");
      $("#editData select").val("");
      $("#editData .newShop").remove();
      $("#editData img").attr("src", "");
    }, function () {
      confirmFn();
    }, function () {
      closeFn();
    });
  });
  initFn(); // 点击查询按钮

  $("#eventqueryBtn").click(function () {
    $("#importInventory").bootstrapTable("refresh");
  }); // 上传图片

  $(".uploadimg").change(function () {
    uploadFile($(this));
  });

  function closeFn() {
    layer.closeAll("page");
  }

  function confirmFn() {
    var required = true;
    $(".required").parent().next().each(function () {
      if (!$(this).val().trim()) {
        required = false;
      }
    });

    if (!required) {
      tips(requiredText, 5);
      return;
    }

    var waresList = [];
    $(".commodity").each(function () {
      var wares = {};
      wares["waresName"] = $(this).find(".name").val().trim();
      wares["waresCount"] = $(this).find(".number").val().trim();
      wares["waresId"] = $(this).find(".name option:selected").attr("data-id");
      wares["isGift"] = 0;
      waresList.push(wares);
    });
    var params = {
      startTime: $(".startTime").val().trim(),
      // 日期
      ordernum: $(".ordernum").val().trim(),
      //订单号
      totalAmount: $(".handleAmount").val().trim(),
      // 应付
      payedAmount: $(".actualAmount").val().trim(),
      // 实付
      remark: $(".remark").val().trim(),
      // 备注
      entryType: 0,
      waresList: waresList,
      fromStoreId: -1,
      // 总公司
      toStoreId: 0 // 公司

    };
    var formdata = new FormData();
    formdata.append("jsonStr", JSON.stringify(params));

    if ($(".uploadimg")[0].files[0]) {
      formdata.append("file", $(".uploadimg")[0].files[0] ? $(".uploadimg")[0].files[0] : undefined);
    }

    var url;
    url = "/inventory/submitEntryStock";
    file_upload(url, formdata, function (res) {
      console.log(res);

      if (res.resultCode > -1) {
        layer.closeAll("page");
        $("#importInventory").bootstrapTable("refresh");
      } else {
        var tipsText;

        if (isadd) {
          tipsText = "入库失败";
        } else {
          tipsText = "修改信息失败";
        }

        tips(tipsText, 5);
      }
    });
  }

  $(".exportBtn").click(function () {
    var form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "/common/exportEntryStockData",
      method: "post"
    });
    $("<input>").attr("name", "jsonStr").val(JSON.stringify({
      startTime: $(".query_startTime").val().trim()
    })).appendTo(form);
    $("body").append(form);
    $("#to_export").submit().remove();
  });
 
 
  $(".actualAmount").on("input",function () {
    let reg=/^[0-9]{0,8}$/;
    let str=`<span class='red inputErr' style="width:100%; margin-left:${$(this).position().left}px">8位以内的整数</span>`;
    if(reg.test($(this).val().trim())){
     $(this).parent().find(".inputErr").remove()
    }else{
     if(!$(this).parent().find(".inputErr").length){
      $(this).parent().append(str)
     }
    }
  })
  $(".textContent").on("input",".number",function () {
    let reg=/^[0-9]{0,8}$/;
    let str=`<span class='red inputErr' style="width:100%;margin-left:${$(this).position().left}px">8位以内的整数</span>`;
    if(reg.test($(this).val().trim())){
      $(this).parent().find(".inputErr").remove()
    }else{
     if(!($(this).parent().find(".inputErr").length)){
      $(this).parent().append(str)
     }
    }
  })
})(document, window, jQuery);

function addCommodity(that) {
  var option = "<option value=''>选择商品名称</option>";

  if (allwares.length) {
    allwares.forEach(function (item, index) {
      option += "<option value=\"".concat(item.waresName, "\" data-id=\"").concat(item.waresId, "\">").concat(item.waresName, "</option>");
    });
  }

  var strHtml = "<div class=\"list_row commodity newShop\">\n            <div style=\"width: 100%;\">\n            <span><i class=\"required\">*</i>\u5546\u54C1\u540D\u79F0</span>\n            <select class=\"form-control name\">\n            ".concat(option, "\n            </select>\n            <span style=\"margin-left: 10px;\"><i class=\"required\">*</i>\u5546\u54C1\u6570\u91CF</span>\n            <input type=\"text\" placeholder=\"\u5546\u54C1\u6570\u91CF\" class=\"form-control number\">\n            <button style=\" margin-left: 10px;\" onclick=\"deleteCommodity(this)\">\u5220\u9664\u5546\u54C1</button>\n            </div></div>\n              ");
  $(".imgdesc").before(strHtml);
}

function deleteCommodity(that) {
  $(that).parent().parent().remove();
}

function queryWaresInfo() {
  var url = "/configuration/queryWaresInfo";
  ajax_data(url, {
    params: JSON.stringify({})
  }, function (res) {
    var option = "<option value='' data-id=''>选择商品名称</option>";

    if (res.length) {
      res.forEach(function (item, index) {
        option += "<option value=\"".concat(item.waresName, "\" data-id=\"").concat(item.waresId, "\">").concat(item.waresName, "</option>");
      });
    }

    allwares = res;
    $(".commodity select").html(option);
  });
}