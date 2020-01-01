(function(document, window, $) {
  "use strict";
  function initFn() {
    $("#importInventory").bootstrapTable({
      method: "get",
      url: baseUrl + "/configuration/queryAchieve", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 10, //单页记录数
      height: $(window).height() - 150,
      pageList: [10, 20, 30], //可选择单页记录数
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      showLoading: true,
      queryParams: queryParams,
      columns: [
        {
          title: "员工id",
          field: "employeeId"
        },
        {
          title: "开始时间",
          field: "startTime"
        },
        {
          title: "结束时间",
          field: "endTime"
        },
        {
          title: "绩效结果",
          field: "achievementResult"
        },
        {
          title: "绩效描述",
          field: "reason"
        }
        // {
        //   title: "操作",
        //   field: "publicationTime",
        //   events: operateEvents,
        //   formatter: operation //对资源进行操作,
        // },
      ],
      exportDataType: "all", //basic', 'all', 'selected'.
      exportOptions: {
        fileName: "绩效数据", //文件名称设置
        worksheetName: "sheet1", //表格工作区名称
        tableName: "数据",
        excelstyles: [
          "background-color",
          "color",
          "font-size",
          "font-weight",
          "border-top"
        ]
      },
      showExport: true, //是否显示导出按钮
      buttonsAlign: "right", //按钮位置
      exportTypes: ["csv"] //导出文件类型
    });
  }
  function operation(vlaue, row) {
    var html = `
      <button type="button" id="edit" class="btn btn-info btn-sm">修改</button>
      `;
    return html;
  }

  var operateEvents = {
    "click #edit": function(e, v, row) {
      open_html("修改信息", "#editData");
    }
  };
  function queryParams(params) {
    return {
      startTime: $(".startTime").val(),
      endTime: $(".endTime").val()
    };
  }
  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#importInventory").bootstrapTable("refresh");
  });

  $("#uploadFile").change(function() {
    var url = "/configuration/achieveImportFiles";
    var fromdata = new FormData();
    fromdata.append("files", $(this)[0].files[0]);
    file_upload(url, fromdata,function(res) {
      console.log(res);
      
    });
  });
// 触发导出事件
  $(".exportBtn").click(function() {
    $(".export.btn-group").click();
  });
})(document, window, jQuery);
