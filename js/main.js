(function(document, window, $) {
    "use strict";
   
    function initFn() {
      $("#CompanyPlan").bootstrapTable({
        method: "post",
        url: baseUrl+"/competence/queryStoreInfo", //请求路径
        striped: true, //是否显示行间隔色
        pageNumber: 1, //初始化加载第一页
        pagination: true, //是否分页
        sidePagination: "client", //server:服务器端分页|client：前端分页
        pageSize: 5, //单页记录数
        pageList: [10, 20, 30], //可选择单页记录数
        showRefresh: false, //刷新按钮
        cache: true, // 禁止数据缓存
        search: false, // 是否展示搜索，
        queryParams: queryParams,
        columns: [
          {
            title: "计划内容",
            field: "storeName"
          },
          {
            title: "计划时间",
            field: "openTime"
          },
          {
            title: "责任人",
            field: "storeType"
          },
          {
            title: "部门",
            field: "store_manager"
          },
          {
            title: "进度",
            field: "openStatus"
          },
          {
            title: "描述",
            field: "openStatus"
          },
        //   {
        //     title: "操作",
        //     field: "publicationTime",
        //     events: operateEvents,
        //     formatter: operation 
        //   }
        ]
      });
    }
  
    function operation(vlaue, row) {
      var html = `
      <button type="button" id="edit" class="btn btn-info btn-sm">修改</button>
      <button type="button" id="delete" class="btn btn-danger deleteBtn btn-sm">删除</button>
      `;
      return html;
    }
    function queryParams(params) {
      return {};
    }
    initFn();
    // 点击查询按钮
    $("#eventqueryBtn").click(function() {
      $("#CompanyPlan").bootstrapTable("refresh");
    });
  })(document, window, jQuery);
  