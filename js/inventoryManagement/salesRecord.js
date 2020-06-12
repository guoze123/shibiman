"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function (document, window, $) {
  "use strict";

  function initFn() {
    // down_list(".detailAddress", "url", "选择地址");
    queryUserRecord();
    $("#storeSalesRecord").bootstrapTable({
      method: "post",
      url: base + "/inventory/querySale",
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
      sortable: true,
      sortOrder: "asc",
      //排序方式
      showLoading: true,
      height: $(window).height() - 190,
      queryParams: queryParams,
      contentType: "application/x-www-form-urlencoded",
      columns: [{
        title: "录入时间",
        field: "operationDate",
        sortable: true
      }, {
        title: "销售员",
        field: "sellers",
        sortable: true
      }, {
        title: "店铺名称",
        field: "storeName",
        sortable: true
      }, {
        title: "本次应付金额",
        field: "totalAmount",
        sortable: true
      }, {
        title: "本次实付金额",
        field: "payedAmount",
        sortable: true
      }, {
        title: "客户类型",
        field: "custType"
      }, {
        title: "备注",
        field: "remark",
        sortable: true
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
      html += "<button type=\"button\" id=\"edit\" class=\"btn btn-info btn-sm editBtn\">\u4FEE\u6539</button>";
    }

    if (purviewList.includes("4")) {
      html += "<button type=\"button\" id=\"detail\" class=\"btn btn-primary btn-sm detailBtn\">\u8BE6\u60C5</button>";
    }

    return html;
  }

  function userOperation(vlaue, row) {
    var purviewList = getQueryString("purview").split(",");
    var html = "";

    if (purviewList.includes("3")) {
      html += "<button type=\"button\" id=\"editUserDataBtn\" class=\"btn btn-info btn-sm editBtn\">\u4FEE\u6539</button>";
    }

    if (purviewList.includes("4")) {
      html += "<button type=\"button\" id=\"userDetailBtn\" class=\"btn btn-primary btn-sm detailBtn\">\u8BE6\u60C5</button>";
    }

    return html;
  }

  var operateEvents = {
    "click #edit": function clickEdit(e, v, row) {
      var params = {
        stockId: row.stockId,
        operationDate: row.operationDate,
        //录入时间
        sellers: row.sellers,
        //销售员
        storeId: row.storeId,
        //店铺id
        totalAmount: row.totalAmount,
        //本次应付金额
        payedAmount: row.payedAmount,
        //本次实付金额
        custType: row.custType,
        //客户类型
        remark: row.remark
      };
      var url = "";
      url = "/inventory/modifyEntryStock";
      ajax_data(url, {
        params: {
          jsonStr: JSON.stringify(params)
        },
        contentType: "application/x-www-form-urlencoded;charset=utf-8"
      }, function (res) {});
      open_html("修改信息", "#editData", function () {
        $("#editData input").val("");
        $("#editData select").val("");
        $("#editData .storeId").trigger("chosen:updated");
      }, function () {
        confirmFn();
      }, function () {
        closeFn();
      });
    },
    "click #detail": function clickDetail(e, v, row) {
      ajax_data("/inventory/querySaleDetail", {
        params: {
          //jsonStr: JSON.stringify({
          stockId: row.stockId,
          startTime: $(".searchList .query_startTime").val().trim() ? $(".searchList .query_startTime").val().trim() : undefined,
          endTime: $(".searchList .query_stopTime").val().trim() ? $(".searchList .query_stopTime").val().trim() : undefined //})

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
          height: $("body").height() < 500 ? $("body").height() - 120 : 330,
          columns: [{
            title: "商品Id",
            field: "waresId"
          }, {
            title: "商品名称",
            field: "waresName"
          }, {
            title: "商品数量",
            field: "waresCount"
          }, {
            title: "是否赠品",
            field: "isGift"
          }]
        });
        open_html("详情信息", "#detail", function () {
          $("input").val("");
        });
      });
    }
  };
  var userOperateEvents = {
    "click #editUserDataBtn": function clickEditUserDataBtn(e, v, row) {
      var params = {
        stockId: row.stockId,
        operationDate: row.operationDate,
        //录入时间
        sellers: row.sellers,
        //销售员
        storeId: row.storeId,
        //店铺id
        totalAmount: row.totalAmount,
        //本次应付金额
        payedAmount: row.payedAmount,
        //本次实付金额
        custType: row.custType,
        //客户类型
        remark: row.remark
      };
      var url = "";
      url = "/inventory/modifyEntryStock";
      ajax_data(url, {
        params: {
          jsonStr: JSON.stringify(params)
        },
        contentType: "application/x-www-form-urlencoded;charset=utf-8"
      }, function (res) {});
      $("#editUserData .stockId").val(row.stockId);
      $("#editUserData .operationDate").val(row.operationDate);
      $("#editUserData .sellers").val(row.sellers);
      $("#editUserData .totalAmount").val(row.totalAmount);
      $("#editUserData .payedAmount").val(row.payedAmount);
      $("#editUserData .remark").val(row.remark);
      $("#editUserData .custType").val(row.custType);
      $("#editUserData .storeId").val(row.storeId);
      $("#editUserData .storeId").trigger("chosen:updated");
      open_html("修改信息", "#editUserData", function () {
        $("#editUserData input").val("");
        $("#editUserData select").val("");
        $("#editUserData .storeId").trigger("chosen:updated");
      }, function () {
        userConfirmFn();
      }, function () {
        closeFn();
      });
    },
    "click #userDetailBtn": function clickUserDetailBtn(e, v, row) {
      ajax_data("/inventory/querySaleDetail", {
        params: {
          jsonStr: JSON.stringify({
            ownerId: row.stockId,
            startTime: $(".areaSearch .startTime").val().trim(),
            endTime: $(".areaSearch .endTime").val().trim()
          })
        },
        contentType: "application/x-www-form-urlencoded;charset=utf-8"
      }, function (res) {
        $("#userDetailTable").bootstrapTable("destroy");
        $("#userDetailTable").bootstrapTable({
          striped: true,
          //是否显示行间隔色
          pagination: false,
          //是否分页,
          data: res,
          height: $("body").height() < 500 ? $("body").height() - 120 : 330,
          columns: [{
            title: "开支时间",
            field: "batchno"
          }, {
            title: "开支的店铺",
            field: "ownerName"
          }, {
            title: "开支名称",
            field: "categoryName"
          }, {
            title: "开支金额",
            field: "amount"
          }]
        });
        open_html("详情信息", "#userDetail", function () {});
      });
    }
  };

  function queryParams() {
    return {
      jsonStr: JSON.stringify(_objectSpread({}, userInformation(), {
        startTime: $(".query_startTime").val().trim() ? $(".query_startTime").val().trim() : undefined,
        endTime: $(".query_stopTime").val().trim() ? $(".query_stopTime").val().trim() : undefined,
        storeName: $(".query_storeName").val().trim() ? $(".query_storeName").val().trim() : undefined
      }))
    };
  }

  function userInformation() {
    var userValue = $(".query_userinformation").val().trim();

    if (userValue) {
      var type = "";

      if (/^[0-9]{5}$/.test(userValue)) {
        type = "id";
      } else if (/^[0-9]{11}$/.test(userValue)) {
        type = "phoneNumber";
      } else {
        type = "name";
      }

      return {
        userType: type,
        userValue: userValue
      };
    } else {
      return {
        userType: undefined,
        userValue: undefined
      };
    }
  }

  function queryUserRecord() {
    $("#userSalesRecord").bootstrapTable({
      method: "get",
      url: "../../testJson/queryPersonalSaleRecord.json",
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
      sortable: true,
      //是否启用排序
      sortOrder: "asc",
      //排序方式
      height: $(window).height() - 190,
      showLoading: true,
      queryParams: queryParams,
      columns: [{
        title: "录入时间",
        field: "operationDate"
      }, {
        title: "销售员",
        field: "sellers"
      }, {
        title: "店铺id",
        field: "storeId "
      }, {
        title: "客户类型",
        field: "custType"
      }, {
        title: "操作",
        field: "publicationTime",
        events: userOperateEvents,
        formatter: userOperation //对资源进行操作,

      }]
    });
  }

  initFn(); // 点击查询按钮

  $("#eventqueryBtn").click(function () {
    // recordType 0 店铺 1 个人
    if ($(".recordType input:checked").val().trim() == "0") {
      $("#storeSalesRecord").bootstrapTable("refresh");
    } else {
      $("#userSalesRecord").bootstrapTable("refresh");
    }
  });

  function closeFn() {
    layer.closeAll("page");
  }

  function confirmFn() {
    var params = {
      stockId: -1,
      operationDate: $(".operationDate").val().trim(),
      //录入时间
      sellers: $(".sellers").val().trim(),
      //销售员
      storeId: $(".storeId").val().trim(),
      //店铺id
      totalAmount: $(".totalAmount").val().trim(),
      //本次应付金额
      payedAmount: $(".payedAmount").val().trim(),
      //本次实付金额
      custType: $(".custType").val().trim() //客户类型

    };
    var url = "";
    url = "/inventory/modifySale";
    ajax_data(url, {
      params: JSON.stringify(params)
    }, function (res) {
      if (res.resultCode > -1) {
        layer.closeAll("page");
        $("#storeSalesRecord").bootstrapTable("refresh");
      } else {
        tips("修改信息失败", 5);
      }
    });
  }

  function userConfirmFn() {
    var params = {
      stockId: -1,
      operationDate: $(".operationDate").val().trim(),
      //录入时间
      sellers: $(".sellers").val().trim(),
      //销售员
      storeId: $(".storeId").val().trim(),
      //店铺id
      custType: $(".custType").val().trim() //客户类型

    };
    var url = "";
    url = "/inventory/modifyEntryStock";
    ajax_data(url, {
      params: JSON.stringify(params)
    }, function (res) {
      if (res.resultCode > -1) {
        layer.closeAll("page");
        $("#userSalesRecord").bootstrapTable("refresh");
      } else {
        tips("修改信息失败", 5);
      }
    });
  }

  $(".recordType input[type='radio']").change(function () {
    if ($(this).val().trim() == "0") {
      $(".storeSalesRecord").show();
      $(".userSalesRecord").hide();
    } else {
      $(".storeSalesRecord").hide();
      $(".userSalesRecord").show();
    }
  }); // 导出

  $(".exportBtn").click(function () {
    var typeVal = "";

    if ($(".recordType input[type='radio']:checked").val().trim() == "0") {
      typeVal = 0;
    } else {
      typeVal = 1;
    }

    var form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "/common/exportSaleData",
      method: "post"
    });
    $("<input>").attr("name", "jsonStr").val(JSON.stringify({
      startTime: $(".query_startTime").val(),
      endTime: $(".query_stopTime").val(),
      type: typeVal,
      storeName: $(".query_storeName").val()
    })).appendTo(form);
    $("body").append(form);
    $("#to_export").submit().remove();
  });
 

})(document, window, jQuery);

 // 添加支付方式
 function add_pay(that){

  let str=`
        <div class="actual_payment">
        <i class="required">*</i>
        选择支付方式：
        <select name="" id="" class="form-control" style="margin-right: 5px;" >
            <option value="0">现金</option>
            <option value="1">微信</option>
            <option value="2">支付宝</option>
            <option value="3">刷卡</option>
            <option value="4">购物卡</option>
            <option value="5">其他</option>
        </select>
        <i class="required">*</i>
        支付金额：
        <input type="text" name="" id="" class="form-control" style="width: 150px;">
        <button style="margin-left: 5px;" onclick="del_pay(this)">删除</button>
    </div>
  `
  $(that).parent().parent().append(str)

}
// 删除支付方式
function del_pay(that) {
  $(that).parent().remove()
}