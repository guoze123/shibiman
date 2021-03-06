"use strict";

(function (document, window, $) {
  "use strict";

  var isadd = false; // 判断是添加还是修改

  function initFn() {
    $("#waresDiscount").bootstrapTable({
      method: "post",
      url: "../../testJson/queryDis.json",
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
        title: "商品id",
        field: "waresId"
      }, {
        title: "商品名称",
        field: "waresName"
      }, {
        title: "商品分类",
        field: "categoryName"
      }, {
        title: "商品进货折扣",
        formatter: function formatter(value, row, index) {
          return "<div style=\"display:flex;align-items:center\">\n                        <input class=\"form-control purchase\"  value=\"".concat(row.buyDiscount, "\" style=\"width:150px;margin-right:5px;\" data-index=\"").concat(index, "\">\n                        </div>");
        }
      }, {
        title: "商品发货折扣",
        formatter: function formatter(value, row, index) {
          return "<div style=\"display:flex;align-items:center\">\n                        <input class=\"form-control ship\" value=\"".concat(row.sellDiscount, "\" style=\"width:150px;margin-right:5px;\" data-index=\"").concat(index, "\"></div>");
        }
      }]
    });
  }

  initFn(); // 点击查询按钮

  $("#eventqueryBtn").click(function () {
    $("#waresDiscount").bootstrapTable("refresh");
  });
  $("#waresDiscount").on("blur", ".purchase", function (e) {
    var row = $("#waresDiscount").bootstrapTable("getData")[$(e.target).attr("data-index")];
    row["buyDiscount"] = $(e.target).val().trim();
    $("#waresDiscount").bootstrapTable("updateRow", {
      index: $(e.target).attr("data-index"),
      row: row
    });
  });
  $("#waresDiscount").on("blur", ".ship", function (e) {
    var row = $("#waresDiscount").bootstrapTable("getData")[$(e.target).attr("data-index")];
    row["sellDiscount"] = $(e.target).val().trim();
    $("#waresDiscount").bootstrapTable("updateRow", {
      index: $(e.target).attr("data-index"),
      row: row
    });
  });

  function queryParams() {
    return {
      waresName: $(".waresName").val().trim() ? $(".waresName").val().trim() : undefined
    };
  } // 点提交按钮


  $(".submitBtn").click(function () {
    var allTableData = $("#waresDiscount").bootstrapTable("getData");
    console.log(allTableData);
    ajax_data("/configuration/modifyDiscount", {
      params: {
        jsonStr: JSON.stringify(allTableData)
      },
      contentType: "application/x-www-form-urlencoded"
    }, function (res) {
      console.log(res);

      if (res.resultCode > -1) {
        tips("修改信息成功", 6);
        $("#waresDiscount").bootstrapTable("refresh");
      } else {
        tips("提交失败", 5);
      }
    });
  });
})(document, window, jQuery);