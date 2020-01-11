(function(document, window, $) {
  "use strict";
  $(".startTime").datepicker({
    startView: 1,
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    minViewMode: 1,
    format: "yyyy-mm"
  });
  $(".startYear").datepicker({
    format: 'yyyy',
    language: "zh-CN",
    autoclose: true,
    startView: 2, maxViewMode: 2,minViewMode:2,
  });
  var columns = [
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
    }
  ];
  function initFn() {
    $("#CompanyPlan").bootstrapTable({
      method: "post",
      url: base + "", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 10, //单页记录数
      height:$(window).height() -150,
      pageList: [10, 20, 30], //可选择单页记录数
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索，
      queryParams: queryParams,
      columns: columns
    });
  }

  function operation(vlaue, row) {
    var html = `
      <button type="button" id="edit" class="btn btn-info btn-sm editBtn">修改</button>
      <button type="button" id="delete" class="btn btn-danger deleteBtn btn-sm">删除</button>
      `;
    return html;
  }
  function queryParams(params) {
    return {
      type: $(".storeType input[type='radio']:checked").val()
    };
  }
  initFn();
  // 点击查询按钮
  $(".storeType input[type='radio']").change(function() {
    if ($(".storeType input[type='radio']:checked").val() == "1") {
      $(".startTime").show();
      $(".startYear").hide();
      columns = [
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
        }
      ];
    } else {
      $(".startTime").hide();
      $(".startYear").show();
      columns = [
        {
          title: "计划内容",
          field: "storeName"
        },
        {
          title: "计划时间",
          field: "openTime"
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
        }
      ];
    }
    $("#CompanyPlan").bootstrapTable("destroy");
    $("#CompanyPlan").bootstrapTable({
      method: "post",
      url: base + "", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 10, //单页记录数
      height:$(window).height() -150,
      pageList: [10, 20, 30], //可选择单页记录数
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      queryParams: queryParams,
      columns: columns
    });
  });
})(document, window, jQuery);
