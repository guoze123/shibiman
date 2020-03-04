"use strict";

(function (document, window, $) {
  "use strict";

  function initFn() {
    $("#departure").bootstrapTable({
      method: "post",
      url: base + "/personnel/queryLeaveEmployeeInfo",
      //请求路径
      striped: true,
      //是否显示行间隔色
      pageNumber: 1,
      //初始化加载第一页
      pagination: true,
      //是否分页
      sidePagination: "client",
      //server:服务器端分页|client：前端分页
      pageSize: 10,
      //单页记录数
      pageList: [10, 20, 30],
      //可选择单页记录数
      height: $(window).height() - 150,
      showRefresh: false,
      //刷新按钮
      cache: true,
      // 禁止数据缓存
      search: false,
      // 是否展示搜索
      showLoading: true,
      contentType: "application/x-www-form-urlencoded",
      queryParams: queryParams,
      columns: [{
        title: "员工工号",
        field: "employeeId"
      }, {
        title: "员工姓名",
        field: "employeeName"
      }, {
        title: "离职时间",
        field: "leaveTime"
      }, {
        title: "离职原因",
        field: "leaveReason"
      } // {
      //   title: "操作",
      //   field: "publicationTime",
      //   events:operateEvents,
      //   formatter: operation //对资源进行操作,
      // }
      ]
    });
  }

  function operation(vlaue, row) {
    var purviewList = getQueryString("purview").split(",");
    var html = "";

    if (purviewList.includes("3")) {
      html += "<button type=\"button\" id=\"edit\" class=\"btn btn-info btn-sm editBtn\">\u4FEE\u6539</button>";
    }

    return html;
  }

  function queryParams() {
    return {
      employeeName: $(".query_employeeName").val().trim()
    };
  }

  initFn(); // 点击查询按钮

  $("#eventqueryBtn").click(function () {
    $("#departure").bootstrapTable("refresh");
  }); // 点击添加

  $(".addBtn").click(function () {
    open_html("添加离职人员", "#editData", function () {
      $("input").val("");
    }, function () {
      confirmFn();
    }, function () {
      closeFn();
    });
  });

  function closeFn() {
    layer.closeAll("page");
  }

  function confirmFn() {
    var required = true;
    $(".required").parent().next().each(function () {
      if (!$(this).val().trim()) {
        required = false;
      }
    });

    if (!required) {
      tips(requiredText, 5);
      return;
    }

    var params = {
      employeeId: $(".employeeId").val().trim(),
      //员工id
      leaveTime: $(".leaveTime").val().trim(),
      leaveReason: $(".leaveReason").val().trim()
    };
    var url;
    url = "/personnel/addLeaveEmployee";
    ajax_data(url, {
      params: JSON.stringify(params)
    }, function (res) {
      console.log(res);

      if (res.resultCode > -1) {
        layer.closeAll("page");
        $("#departure").bootstrapTable("refresh");
      } else {
        tips("添加离职人员失败", 5);
      }
    });
  }
})(document, window, jQuery);