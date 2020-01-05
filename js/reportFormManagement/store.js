(function(document, window, $) {
  "use strict";

  $(".startTime ,.endTime").datepicker({
    startView: 1,
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    minViewMode: 1,
    format: "yyyy-mm"
  });
  function initFn() {
    $("#storeSales").bootstrapTable({
      method: "post",
      url: baseUrl + "/inventory/queryStoreAnalysisTable", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 10, //单页记录数
      pageList: [10, 20, 30], //可选择单页记录数
      height: $(window).height() - 150,
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      showLoading: true,
      queryParams: queryParams,
      contentType: "application/x-www-form-urlencoded",
      responseHandler:function (res) {
        return res.storeData
      },
      columns: [
        {
          title: "时间",
          field: "bathno"
        },
        {
          title: "店铺名称",
          field: "storeName"
        },
        {
          title: "销售额",
          field: "sales"
        },
        {
          title: "利润",
          field: "profit"
        },
        {
          title: "等级",
          field: "alesCategery"
        },
        {
          title: "完成率",
          field: "alesCategery"
        },
        {
          title: "目标值",
          field: "targetValue"
        },
        {
          title: "平均值",
          field: "alesCategery"
        },
        {
          title: "平均等级",
          field: "alesCategery"
        },
          {
            title: "操作",
            field: "publicationTime",
            events:operateEvents,
            formatter: operation //对资源进行操作,
          }
      ]
    });
  }
 // <button type="button" id="edit" class="btn btn-info btn-sm">修改</button>
  function operation(vlaue, row) {
    var html = `
      <button type="button" id="edit" class="btn btn-info btn-sm">详情</button>
      `;
    return html;
  }

  var operateEvents = {
    "click #edit": function(e, v, row) {
      open_html("修改信息", "#editData");
    },
    "click #detail": function(e, v, row) {
      ajax_data(
        "",
        { params: JSON.stringify({ stockId: row.stockId }) },
        function(res) {

          open_html("详情信息", "#detail", function() {});
        }
      );
    }
  };
  function queryParams(params) {
    return {jsonStr:JSON.stringify({
      startTime: $(".startTime").val()?$(".startTime").val():undefined,
      endTime: $(".endTime").val()?$(".endTime").val():undefined,
      address: $(".detailAddress").val()?$(".detailAddress").val():undefined
    })} ;
  }
  function queryStoreParams(params) {
    return {
      startTime: $(".startTime").val(),
      stopTime: $(".endTime").val(),
      address: $(".detailAddress").val()
    };
  }
  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#storeSales").bootstrapTable("refresh");
  });
  $("#queryStore").click(function() {
    $("#storeProfit").bootstrapTable("refresh");
  });
})(document, window, jQuery);
