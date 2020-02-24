(function(document, window, $) {
  "use strict";
  let purviewList = getQueryString("purview").split(",");
  if(purviewList.includes("5") || purviewList.includes("6")){
  }else{
    $(".main_title").remove()
  }
  var url = "/configuration/queryPlan";
  dateRange(".startTime",".endTime");
  yearRange(".startYear",".endYear");
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
              title: "计划名称",
              field: "planName"
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
              title: "备注",
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
              title: "计划名称",
              field: "planName"
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
              title: "计划内容",
              field: "content"
            },
            
            {
              title: "部门",
              field: "department"
            },
            {
              title: "责任人",
              field: "responsible"
            },
            {
              title: "进度",
              field: "progress"
            },
            {
              title: "备注",
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
            startTime: $(".startYear").val()?$(".startYear").val() :undefined,
            endTime: $(".endYear").val()? $(".endYear").val():undefined,
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
              title: "计划名称",
              field: "planName"
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
              title: "备注",
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
            startTime: $(".startTime").val()? $(".startTime").val():undefined,
            endTime: $(".endTime").val()? $(".endTime").val():undefined
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
              title: "计划名称",
              field: "planName"
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
              title: "计划内容",
              field: "content"
            },
            
            {
              title: "部门",
              field: "department"
            },
            {
              title: "责任人",
              field: "responsible"
            },
            {
              title: "进度",
              field: "progress"
            },
            {
              title: "备注",
              field: "planDesc"
            }
          ]
        });
      }
    );
  });

  // 导出 年导出 月导出
  $(".yearExport").click(function() {
    //alert($(this).parents(".ibox").find(".ibox-title h5 ").text())
    let form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "/common/exportPlanTemplate",
      method: "post"
    });
    $("<input>")
      .attr("name", "jsonStr")
      .val(JSON.stringify({
        fileName: $(this).parents(".ibox").find(".ibox-title h5 ").text()
      }))
      .appendTo(form);
    $("body").append(form);
    $("#to_export")
      .submit()
      .remove();
  });
  $(".monthExport").click(function() {
    let form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "/common/exportPlanTemplate",
      method: "post"
    });
    $("<input>")
      .attr("name", "jsonStr")
      .val(JSON.stringify({}))
      .appendTo(form);
    $("body").append(form);
    $("#to_export")
      .submit()
      .remove();
  });
  // 导入

  $("#yearUploadFile").change(function() {
    var fromdata = new FormData();
    fromdata.append("files", $(this)[0].files[0]);
    file_upload("/common/importPlanFile", fromdata, function(res) {
      if (res.length > 0) {
        initFn();
        tips("文件导入成功", 6);
      } else {
        tips("文件导入失败", 5);
      }
      $("#yearUploadFile").val("");
    });
  });

  $("#monthUploadFile").change(function() {
    var fromdata = new FormData();
    fromdata.append("files", $(this)[0].files[0]);
    file_upload("/common/importPlanFile", fromdata, function(res) {
      if (res.length > 0) {
        initFn();
        tips("文件导入成功", 6);
      } else {
        tips("文件导入失败", 5);
      }
      $("#yearUploadFile").val("");
    });
  });
})(document, window, jQuery);
