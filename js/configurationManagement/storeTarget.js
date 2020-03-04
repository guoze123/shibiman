"use strict";

(function (document, window, $) {
  "use strict";

  $(".query_startTime").datepicker({
    startView: 1,
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    minViewMode: 1,
    format: "yyyy-mm"
  });

  function initFn() {
    $("#storeTarget").bootstrapTable({
      method: "post",
      url: base + "/configuration/queryTargetInit",
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
      showRefresh: false,
      //刷新按钮
      cache: true,
      // 禁止数据缓存
      search: false,
      // 是否展示搜索
      showLoading: true,
      height: $(window).height() - 150,
      queryParams: queryParams,
      contentType: "application/x-www-form-urlencoded",
      columns: [{
        title: "时间",
        field: "batchno"
      }, {
        title: "店铺名称",
        field: "storeName"
      }, {
        title: "店铺目标值",
        // events: operateEvents,
        formatter: function formatter(value, row, index) {
          var str = "<div style=\"display:flex;align-items:center\">\n            <input class=\"form-control inputTargetValue ".concat("target" + row.storeId, "\" value=\"").concat(row.targetValue ? row.targetValue : "", "\" style=\"width:150px;margin-right:5px;\" data-index=\"").concat(index, "\">\n            </div>");
          return str;
        }
      }]
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
      jsonStr: JSON.stringify({
        storeName: $(".storeName").val().trim() ? $(".storeName").val().trim() : undefined
      })
    };
  }

  initFn();
  $("#storeTarget").on("blur", ".inputTargetValue", function (e) {
    console.log($(e.target).val().trim());
    var row = $("#storeTarget").bootstrapTable("getData")[$(e.target).attr("data-index")];
    row["targetValue"] = $(e.target).val().trim();
    $("#storeTarget").bootstrapTable("updateRow", {
      index: $(e.target).attr("data-index"),
      row: row
    });
  }); // 点击查询按钮

  $("#eventqueryBtn").click(function () {
    $("#storeTarget").bootstrapTable("refresh");
  });
  $(".condition .closeBtn").on("click", function (params) {
    layer.closeAll("page");
  }); // 添加或修改

  $("#keepPaying .condition .confirmBtn").on("click", function () {
    var params = {
      storckId: $("#keepPaying .storckId").val().trim(),
      storckName: $("#keepPaying .storckName").val().trim()
    };
    ajax_data("", {
      params: JSON.stringify(params)
    }, function (res) {
      if (res.resultCode > -1) {
        layer.closeAll("page");
        $("#storeTarget").bootstrapTable("refresh");
      } else {
        tipe("修改信息失败", 5);
      }
    });
  }); // 点击提交 保存修改的数据

  $(".submitBtn").click(function () {
    var allTableData = $("#storeTarget").bootstrapTable("getData");
    var params = [];
    allTableData.forEach(function (item) {
      var obj = {
        storeId: item.storeId,
        targetValue: item.targetValue
      };
      params.push(obj);
    });
    ajax_data("/configuration/modifyTargetValue", {
      params: {
        jsonStr: JSON.stringify(params)
      },
      contentType: "application/x-www-form-urlencoded"
    }, function (res) {
      console.log(res);

      if (res.resultCode > -1) {
        tips("修改信息成功", 6);
        $("#storeTarget").bootstrapTable("refresh");
      } else {
        tips("提交失败", 5);
      }
    });
  }); // 导出

  $(".exportBtn").click(function () {
    var form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "/common/exportStoreTargetTemplate",
      method: "post"
    });
    $("<input>").attr("name", "batchno").val("").appendTo(form);
    $("body").append(form);
    $("#to_export").submit().remove();
  }); // 导入

  $("#uploadFile").change(function () {
    var url = "/common/exportStoreTargetTemplate";
    var fromdata = new FormData();
    fromdata.append("files", $(this)[0].files[0]);
    file_upload("/common/importStoreTargetFiles", fromdata, function (res) {
      if (res.length > 0) {
        $("#storeTarget").bootstrapTable("refresh");
        tips("文件导入成功", 6);
      } else {
        tips("文件导入失败，请重新导入", 5);
      }

      $("#uploadFile").val("");
    });
  });
})(document, window, jQuery);