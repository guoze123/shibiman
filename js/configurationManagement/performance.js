(function(document, window, $) {
  "use strict";
  $(".startTime,.endTime").datepicker({
    startView: 1,
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    minViewMode: 1,
    format: "yyyy-mm"
  });
  function initFn() {
    $("#importInventory").bootstrapTable({
      method: "post",
      url: base + "/personnel/queryEmployeeAchievement", //请求路径
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
      contentType: "application/x-www-form-urlencoded",
      queryParams: queryParams,
      columns: [
        {
          title: "员工id",
          field: "employeeId"
        },
        {
          title: "员工名称",
          field: "employeeName"
        },
        {
          title: "绩效时间",
          field: "batchno"
        },
        {
          title: "绩效结果",
          field: "achievementResult"
        },
        {
          title: "绩效原因",
          field: "reason"
        }
     
      ]
    });
  }
  function queryParams() {
    return {
      jsonStr:JSON.stringify({
        startTime: $(".startTime").val() ? $(".startTime").val() : undefined,
        endTime: $(".endTime").val() ? $(".endTime").val() : undefined
      })
    };
  }
  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#importInventory").bootstrapTable("refresh");
  });
  $("#uploadFile").change(function() {
    var fromdata = new FormData();
    fromdata.append("files", $(this)[0].files[0]);
    file_upload("/common/importAchievement", fromdata, function(res) {
      console.log(res);
      $("#uploadFile").val("");
      $("#importInventory").bootstrapTable("refresh");
    });
  });

  // 导出
  $(".exportBtn").click(function() {
    let form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "/common/exportArchievementTemplate",
      method: "post"
    });
    $("<input>")
      .attr("name", "batchno")
      .val($(".startTime").val())
      .appendTo(form);
    $("body").append(form);
    $("#to_export")
      .submit()
      .remove();
  });
})(document, window, jQuery);
