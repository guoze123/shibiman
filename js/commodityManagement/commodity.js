"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function (document, window, $) {
  "use strict";

  var isadd = false; // 判断是添加还是修改

  function initFn() {
    var _$$bootstrapTable;

    $("#waresManagement").bootstrapTable((_$$bootstrapTable = {
      method: "post",
      url: base + "/configuration/queryWaresInfo",
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
      showLoading: true
    }, _defineProperty(_$$bootstrapTable, "height", $(window).height() - 150), _defineProperty(_$$bootstrapTable, "queryParams", queryParams), _defineProperty(_$$bootstrapTable, "columns", [{
      title: "商品id",
      field: "waresId"
    }, {
      title: "商品名称",
      field: "waresName"
    }, {
      title: "商品分类",
      field: "categoryName"
    }, {
      title: "商品价格",
      field: "waresPrice"
    }, {
      title: "商品描述",
      field: "waresDesc"
    }, {
      title: "操作",
      field: "publicationTime",
      events: operateEvents,
      formatter: operation //对资源进行操作,

    }]), _$$bootstrapTable));
    queryWaresCategory();
  }

  function operation(vlaue, row) {
    var purviewList = getQueryString("purview").split(",");
    var html = "";

    if (purviewList.includes("3")) {
      html += "<button type=\"button\" id=\"edit\" class=\"btn btn-info btn-sm editBtn\">\u4FEE\u6539</button>";
    }

    if (purviewList.includes("2")) {
      html += "<button type=\"button\" id=\"delete\" class=\"btn btn-danger btn-sm deleteBtn\">\u5220\u9664</button>";
    }

    return html;
  }

  var operateEvents = {
    "click #edit": function clickEdit(e, v, row) {
      isadd = false;
      $(".wares_name").val(row.waresName); // 名称

      $(".wares_name").attr("data-waresId", row.waresId); // 名称

      $(".category_name").val(row.categoryName); //商品分类

      $(".wares_price").val(row.waresPrice); //商品价格

      $(".wares_desc").val(row.waresDesc); //商品描述

      open_html("修改信息", "#editData", function () {
        $("#editData input").val("");
        $("#editData select").val("");
      }, function () {
        confirmFn();
      }, function () {
        closeFn();
      });
    },
    "click #delete": function clickDelete(e, v, row) {
      firm("提示", "是否删除", function () {
        layer.closeAll("page");
        ajax_data("/configuration/deleteWaresInfo", {
          params: {
            waresId: row.waresId
          },
          contentType: "application/x-www-form-urlencoded"
        }, function (res) {
          console.log(res);

          if (res.resultCode > -1) {
            tips("删除成功", 6);
            $("#waresManagement").bootstrapTable("refresh"); //刷新url！
          } else {
            tips("删除失败", 5);
          }
        });
      });
    }
  };

  function queryParams() {
    return {
      waresName: $(".searchList .query_wares_name").val().trim() ? $(".searchList .query_wares_name").val().trim() : undefined,
      categoryName: $(".searchList .query_category_name").val().trim() ? $(".searchList .query_category_name").val().trim() : undefined
    };
  }

  initFn(); // 点击查询按钮

  $("#eventqueryBtn").click(function () {
    $("#waresManagement").bootstrapTable("refresh");
  }); // 添加商品

  $(".addBtn").click(function () {
    isadd = true;
    open_html("添加商品", "#editData", function () {
      $("#editData input").val("");
      $("#editData select").val("");
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
      waresId: $(".wares_name").attr("data-waresId") ? $(".wares_name").attr("data-waresId") : -1,
      waresName: $(".wares_name").val().trim(),
      // 名称
      categoryName: $(".category_name").val().trim(),
      //商品分类名称
      waresPrice: $(".wares_price").val().trim(),
      //商品价格
      waresDesc: $(".wares_desc").val().trim() //商品描述

    };
    var url;

    if (isadd) {
      url = "/configuration/addWaresInfo";
    } else {
      url = "/configuration/modifyWaresInfo";
    }

    ajax_data(url, {
      params: JSON.stringify(params)
    }, function (res) {
      console.log(res);

      if (res.resultCode > -1) {
        layer.closeAll("page");
        $("#waresManagement").bootstrapTable("refresh");
      } else {
        var tipsText;

        if (isadd) {
          tipsText = "添加商品失败";
        } else {
          tipsText = "修改商品失败";
        }

        tips(tipsText, 5);
      }
    });
  } // 查询商品分类


  function queryWaresCategory() {
    ajax_data("/configuration/queryWaresCategory", {
      params: JSON.stringify({})
    }, function (res) {
      var option = "<option value=''>选择商品分类</option>";
      res.forEach(function (element) {
        option += "<option value=\"".concat(element, "\">").concat(element, "</option>");
      });
      $(".query_category_name").html(option);
      $(".category_name").html(option);
    });
  } // 导出


  $(".exportBtn").click(function () {
    var form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "/common/exportWaresOrCostData",
      method: "post"
    });
    $("<input>").attr("name", "type").val("0").appendTo(form);
    $("<input>").attr("name", "jsonStr").val(JSON.stringify({
      waresName: $(".query_wares_name").val().trim(),
      categoryName: $(".query_category_name").val().trim()
    })).appendTo(form);
    $("body").append(form);
    $("#to_export").submit().remove();
  });
})(document, window, jQuery);