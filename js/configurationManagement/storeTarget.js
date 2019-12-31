(function(document, window, $) {
    "use strict";
    function initFn() {
      $("#storeTarget").bootstrapTable({
        method: "get",
        url: baseUrl+"../../testJson/storeManagement.json", //请求路径
        striped: true, //是否显示行间隔色
        pageNumber: 1, //初始化加载第一页
        pagination: true, //是否分页
        sidePagination: "client", //server:服务器端分页|client：前端分页
        pageSize: 10, //单页记录数
      //  pageList: [10, 20, 30], //可选择单页记录数
        showRefresh: false, //刷新按钮
        cache: true, // 禁止数据缓存
        search: false, // 是否展示搜索
        showLoading: true,
        height:$(window).height()-130,
        queryParams: queryParams,
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
            title: "店铺目标值",
            field: "storeTarget"
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
    function operation(vlaue, row) {
      var html = `
        <button type="button" id="edit" class="btn btn-info btn-sm editBtn" >修改</button>
        `;
      return html;
    }
  
    var operateEvents = {
      "click #edit": function(e, v, row) {
        open_html("修改信息", "#editData");
      }
    };
    function queryParams() {
      return {
        startTime:$(".query_startTime").val() ? $(".query_startTime").val() : undefined,
        address:$(".detailAddress").val()? $(".detailAddress").val() :undefined
      };
    }
    initFn();
    // 点击查询按钮
    $("#eventqueryBtn").click(function() {
      $("#storeTarget").bootstrapTable("refresh");
    });
    $(".condition .closeBtn").on("click", function(params) {
      layer.close(layer.index);
    });
    // 添加或修改
    $("#keepPaying .condition .confirmBtn").on("click", function() {
      let params={
        storckId:$("#keepPaying .storckId").val(),
        storckName:$("#keepPaying .storckName").val(),
      }
      ajax_data("", {params:JSON.stringify(params)}, function(res) {
       console.log(res);
       $("#storeTarget").bootstrapTable("refresh");
      });
    });
  })(document, window, jQuery);
  