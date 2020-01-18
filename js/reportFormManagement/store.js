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
      url: base + "/inventory/queryStoreAnalysisTable", //请求路径
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
      // responseHandler: function(res) {
      //     return res.storeAvgData;
      // },
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
          events: operateEvents,
          formatter: operation //对资源进行操作,
        }
      ]
    });
  }
  // <button type="button" id="edit" class="btn btn-info btn-sm">修改</button>
  function operation(vlaue, row) {
    let purviewList = getQueryString("purview").split(",");
    let html = "";
    if (purviewList.includes("4")) {
      html += `<button type="button" id="detail" class="btn  btn-primary detailBtn btn-sm">详情</button>`;
    }
    return html;
  }

  var operateEvents = {
    "click #detail": function(e, v, row) {
      ajax_data(
        "/inventory/queryStoreAnalysisDetail",
        {
          params: {
            jsonStr: JSON.stringify({
              storeId: row.storeId
            })
          },
          contentType: "application/x-www-form-urlencoded;charset=utf-8"
        },
        function(res) {
          $("#storeDetailTable").bootstrapTable("destroy");
          $("#storeDetailTable").bootstrapTable({
            striped: true, //是否显示行间隔色
            pagination: false, //是否分页,
            data: res,
            height: $("body").height() < 500 ? $("body").height() - 120 : 300,
            columns: [
              {
                title: "开支时间",
                field: "batchno"
              },
              {
                title: "开支的店铺",
                field: "ownerName"
              },
              {
                title: "开支名称",
                field: "categoryName"
              },
              {
                title: "开支金额",
                field: "amount"
              }
            ]
          });
          open_html("详情信息", "#detail", function() {});
        }
      );
    }
  };

  function queryParams(params) {
    return {
      jsonStr: JSON.stringify({
        startTime: $(".startTime")
          .val()
          .trim()
          ? $(".startTime")
              .val()
              .trim()
          : undefined,
        endTime: $(".endTime")
          .val()
          .trim()
          ? $(".endTime")
              .val()
              .trim()
          : undefined,
        address: $(".detailAddress")
          .val()
          .trim()
          ? $(".detailAddress")
              .val()
              .trim()
          : undefined
      })
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
  // 导出
  $(".exportBtn").click(function() {
    let form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "/common/exportStoreTargetTemplate",
      method: "post"
    });
    $("<input>")
      .attr("name", "batchno")
      .val("")
      .appendTo(form);
    $("body").append(form);
    $("#to_export")
      .submit()
      .remove();
  });
})(document, window, jQuery);
