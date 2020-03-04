"use strict";

(function (document, window, $) {
  "use strict";

  $(".query_startTime ,.query_stopTime").datepicker({
    startView: 1,
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    minViewMode: 1,
    format: "yyyy-mm"
  });

  function initFn() {
    $("#payment").bootstrapTable({
      method: "post",
      url: base + "/inventory/queryPayment",
      //请求路径
      // url: "../../testJson/storeManagement.json", //请求路径
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
      height: $(window).height() - 150,
      showRefresh: false,
      //刷新按钮
      cache: true,
      // 禁止数据缓存
      contentType: "application/x-www-form-urlencoded",
      search: false,
      // 是否展示搜索
      showLoading: true,
      queryParams: queryParams,
      columns: [{
        title: "店铺id",
        field: "storeId"
      }, {
        title: "店铺名称",
        field: "storeName"
      }, {
        title: "应付金额",
        field: "totalAmount"
      }, {
        title: "实支付金额",
        field: "payedAmount"
      }, {
        title: "尾款",
        field: "balance"
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
      html += "<button type=\"button\" id=\"paymentBtn\" class=\"btn btn-info btn-sm paymentBtn\">\u7EE7\u7EED\u652F\u4ED8</button>";
    }

    if (purviewList.includes("4")) {
      html += "<button type=\"button\" id=\"detailBtn\" class=\"btn btn-info btn-sm detailBtn\">\u652F\u4ED8\u8BE6\u60C5</button>";
    }

    return html;
  }

  var operateEvents = {
    "click #detailBtn": function clickDetailBtn(e, v, row) {
      var params = {
        storckId: row.storckId,
        storeId: row.storeId
      };
      ajax_data("/inventory/queryPaymentDetail", {
        params: {
          jsonStr: JSON.stringify(params)
        },
        contentType: "application/x-www-form-urlencoded;charset=utf-8"
      }, function (res) {
        $("#paymentDetailTable").bootstrapTable("destroy");
        $("#paymentDetailTable").bootstrapTable({
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
      });
      open_html("支付详情", "#payDetail", function () {
        $("input[type='text']").val("");
      });
    },
    "click #paymentBtn": function clickPaymentBtn(e, v, row) {
      $("#keepPaying .storckId").val(row.storckId);
      $("#keepPaying .storeName").val(row.storckName);
      $("#keepPaying .totalAmount").val(row.totalAmount);
      $("#keepPaying .storeId").val(row.storeId);
      open_html("继续支付", "#keepPaying", function () {
        $("input[type='text']").val("");
      }, function () {
        confirmFn();
      }, function () {
        closeFn();
      });
    }
  };

  function queryParams() {
    return {
      jsonStr: JSON.stringify({
        startTime: $(".query_startTime").val().trim() ? $(".query_startTime").val().trim() : undefined,
        endTime: $(".query_stopTime").val().trim() ? $(".query_stopTime").val().trim() : undefined
      })
    };
  }

  initFn(); // 点击查询按钮

  $("#eventqueryBtn").click(function () {
    $("#payment").bootstrapTable("refresh");
  });

  function closeFn() {
    layer.closeAll("page");
  } // 添加或修改


  function confirmFn() {
    var params = {
      storckId: $("#keepPaying .storckId").val().trim(),
      storeId: $("#keepPaying .storeId").val().trim(),
      paymentTime: $("#keepPaying .payTime").val().trim(),
      totalAmount: $("#keepPaying .totalAmount").val().trim(),
      paymentAmount: $("#keepPaying .amount").val().trim(),
      paymentWay: $("#keepPaying .payType inpu[type='radio']:checked").val().trim()
    };
    ajax_data("", {
      params: JSON.stringify(params)
    }, function (res) {
      if (res.resultCode > -1) {
        layer.closeAll("page");
        $("#payment").bootstrapTable("refresh");
      } else {
        tips("支付失败", 5);
      }
    });
  }
})(document, window, jQuery);