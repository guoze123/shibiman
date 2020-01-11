(function(document, window, $) {
  "use strict";
  var url = "/configuration/queryPlan";
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
    format: "yyyy",
    language: "zh-CN",
    autoclose: true,
    startView: 2,
    maxViewMode: 2,
    minViewMode: 2
  });

  function initFn() {
    ajax_data(
      url,
      {
        params: {
          jsonStr: JSON.stringify({})
        },
        contentType: "application/x-www-form-urlencoded"
      },
      function(res) {
        $("#companyYearPlan").bootstrapTable({
          data: res.year,
          striped: true, //是否显示行间隔色
          pageNumber: 1, //初始化加载第一页
          cache: true, // 禁止数据缓存
          search: false, // 是否展示搜索，
          pagination: false, //是否分页
          columns: [
            {
              title: "计划时间",
              field: "planPeriod"
            },
            {
              title: "计划内容",
              field: "content"
            },
            {
              title: "部门",
              field: "department"
            },
            {
              title: "进度",
              field: "progress"
            },
            {
              title: "描述",
              field: "planDesc"
            }
          ]
        });
        $("#companyMonthPlan").bootstrapTable({
          data: res.month,
          striped: true, //是否显示行间隔色
          cache: true, // 禁止数据缓存
          search: false, // 是否展示搜索，
          pagination: false, //是否分页
          columns: [
            {
              title: "计划时间",
              field: "planPeriod"
            },
            {
              title: "计划内容",
              field: "content"
            },
            {
              title: "责任人",
              field: "responsible"
            },
            {
              title: "部门",
              field: "department"
            },
            {
              title: "进度",
              field: "progress"
            },
            {
              title: "描述",
              field: "planDesc"
            }
          ]
        });
      }
    );
  }

  initFn();
  // 点击查询按钮
  // 年度查询
  $("#queryYearBtn").click(function() {
    ajax_data(
      url,
      {
        params: {
          jsonStr: JSON.stringify({
            planType: 0,
            batchno: $(".startYear").val()
          })
        },
        contentType: "application/x-www-form-urlencoded"
      },
      function(res) {
        $("#companyYearPlan").bootstrapTable("destroy");
        $("#companyYearPlan").bootstrapTable({
          data: res.year,
          striped: true, //是否显示行间隔色
          cache: true, // 禁止数据缓存
          search: false, // 是否展示搜索，
          pagination: false, //是否分页
          columns: [
            {
              title: "计划时间",
              field: "planPeriod"
            },
            {
              title: "计划内容",
              field: "content"
            },

            {
              title: "部门",
              field: "department"
            },
            {
              title: "进度",
              field: "progress"
            },
            {
              title: "描述",
              field: "planDesc"
            }
          ]
        });
      }
    );
  });

  $("#queryMonthBtn").click(function() {
    ajax_data(
      url,
      {
        params: {
          jsonStr: JSON.stringify({
            planType: 1,
            batchno: $(".startTime").val()
          })
        },
        contentType: "application/x-www-form-urlencoded"
      },
      function(res) {
        $("#companyMonthPlan").bootstrapTable("destroy");
        $("#companyMonthPlan").bootstrapTable({
          data: res.month,
          striped: true, //是否显示行间隔色
          cache: true, // 禁止数据缓存
          search: false, // 是否展示搜索，
          pagination: false, //是否分页
          columns: [
            {
              title: "计划时间",
              field: "planPeriod"
            },
            {
              title: "计划内容",
              field: "content"
            },
            {
              title: "责任人",
              field: "responsible"
            },
            {
              title: "部门",
              field: "department"
            },
            {
              title: "进度",
              field: "progress"
            },
            {
              title: "描述",
              field: "planDesc"
            }
          ]
        });
      }
    );
  });

  // 导出
  $(".exportBtn").click(function() {
    let form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "/common/exportPlanTemplate",
      method: "post"
    });
    $("<input>")
      .attr("name", "jsonStr")
      .val(
        JSON.stringify({})
      )
      .appendTo(form);
    $("body").append(form);
    $("#to_export")
      .submit()
      .remove();
  });
  // 导入
  $("#uploadFile").change(function() {
    var fromdata = new FormData();
    fromdata.append("files", $(this)[0].files[0]);
    file_upload("/common/importPlanFile", fromdata, function(res) {
      $("#uploadFile").val("");
      initFn();
    });
  });
})(document, window, jQuery);
