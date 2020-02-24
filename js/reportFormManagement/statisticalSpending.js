(function(document, window, $) {
  "use strict";
  var isadd = false;
  dataTimeRange(".startTime",".endTime")
  function dataTimeRange(start,end){//日期范围
    $(start).datepicker({
      endDate : new Date(),
      //startView : 1,
      todayBtn : "linked",
      keyboardNavigation : false,
      forceParse : false,
      autoclose : true,
      format : "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var startTime = e.date;
        $(end).datepicker('setStartDate',startTime);
    });
    //结束时间
    $(end).datepicker({
      endDate : new Date(),
      //startView : 1,
      todayBtn : "linked",
      keyboardNavigation : false,
      forceParse : false,
      autoclose : true,
      format : "yyyy-mm-dd"
    }).on('changeDate',function(e){
        var endTime = e.date;
        $(start).datepicker('setEndDate',endTime);
    });
  } 

  function initFn() {
    $("#statisticalSpending").bootstrapTable({
      method: "post",
      url: base + "/cost/queryCostAnalysis", //请求路径
      //url: "../../testJson/storeManagement.json", //请求路径
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
      contentType: "application/x-www-form-urlencoded",
      queryParams: queryParams,
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
          title: "开支金额",
          field: "amount"
        },
        {
          title: "操作",
          field: "publicationTime",
          events: operateEvents,
          formatter: operation //对资源进行操作,
        }
      ]
    });
    //queryCostType();
  }

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
        "/cost/queryCostAnalysisDetail",
        {
          params: {
            jsonStr: JSON.stringify({
              ownerId: row.ownerId,
              startTime: $(".searchList  .startTime")
                .val()
                .trim(),
              endTime: $(".searchList  .endTime")
                .val()
                .trim()
            })
          },
          contentType: "application/x-www-form-urlencoded;charset=utf-8"
        },
        function(res) {
          $("#costDetailTable").bootstrapTable("destroy");
          $("#costDetailTable").bootstrapTable({
            striped: true, //是否显示行间隔色
            pagination: false, //是否分页,
            data: res,
            height: $("body").height() < 500 ? $("body").height() - 120 : 330,
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
          open_html("详情信息", "#costDetail", function() {});
        }
      );
    }
  };
  //查询条件
  function queryParams() {
    return {
      jsonStr: JSON.stringify({
        startTime: $(".searchList .startTime")
          .val()
          .trim()
          ? $(".searchList  .startTime")
              .val()
              .trim()
          : undefined, // 开支时间
        endTime: $(".searchList  .endTime")
          .val()
          .trim()
          ? $(".searchList  .endTime")
              .val()
              .trim()
          : undefined, // 开支时间
        costTypeId: $(".searchList  .query_costTypeId")
          .val()
          .trim()
          ? $(".searchList  .query_costTypeId")
              .val()
              .trim()
          : undefined, // 开支分类id
        ownerName: $(".searchList  .query_ownerName")
          .val()
          .trim()
          ? $(".searchList .query_ownerName")
              .val()
              .trim()
          : undefined // 部门名称
      })
    };
  }
  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#statisticalSpending").bootstrapTable("refresh");
  });

  $(".uploadimg").change(function() {
    uploadFile($(this));
  });
  $(".condition .closeBtn").on("click", function(params) {
    layer.closeAll("page");
  });
  $(".query_costTypeId").chosen({});
  // 开支分类
  function queryCostType() {
    let params = {};
    ajax_data(
      "/cost/queryCostCategory",
      { params: JSON.stringify(params) },
      function(res) {
        let option = "<option value=''>开支分类</option>";
        res.forEach(function(element) {
          option += `<option value="${element.categoryId}">${element.categoryName}</option>`;
        });
        $(".query_costTypeId").html(option);
        $(".query_costTypeId").chosen({});
      }
    );
  }
})(document, window, jQuery);
