(function(document, window, $) {
  "use strict";

  function initFn() {
    // down_list(".detailAddress", "url", "选择地址");
    queryUserRecord();
    $("#storeSalesRecord").bootstrapTable({
      method: "post",
      url: base + "/inventory/querySale", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 5, //单页记录数
      pageList: [10, 20, 30], //可选择单页记录数
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      showLoading: true,
      height: $(window).height() - 150,
      queryParams: queryParams,
      columns: [
        {
          title: "录入时间",
          field: "operationDate"
        },
        {
          title: "销售员",
          field: "sellers"
        },
        {
          title: "店铺id",
          field: "storeId "
        },
        {
          title: "本次应付金额",
          field: "totalAmount"
        },
        {
          title: "本次实付金额",
          field: "payedAmount"
        },
        {
          title: "客户类型",
          field: "custType"
        },
        {
          title: "操作",
          field: "publicationTime",
          events: operateEvents,
          formatter: operation //对资源进行操作,
        }
      ]
    });
  }

  function operation(vlaue, row) {
    let purviewList = getQueryString("purview").split(",");
    let html = "";
    if (purviewList.includes("3")) {
      html += `<button type="button" id="edit" class="btn btn-info btn-sm editBtn">修改</button>`;
    }
    if (purviewList.includes("4")) {
      html += `<button type="button" id="detail" class="btn btn-primary btn-sm detailBtn">详情</button>`;
    }
    return html;
  }

  function userOperation(vlaue, row) {
    let purviewList = getQueryString("purview").split(",");
    let html = "";
    if (purviewList.includes("3")) {
      html += `<button type="button" id="editUserData" class="btn btn-info btn-sm editBtn">修改</button>`;
    }
    if (purviewList.includes("4")) {
      html += `<button type="button" id="userDetail" class="btn btn-primary btn-sm detailBtn">详情</button>`;
    }
    return html;
  }

  var operateEvents = {
    "click #edit": function(e, v, row) {
      open_html("修改信息", "#editData", function() {
        $("input").val();
      });
    },
    "click #detail": function(e, v, row) {
      ajax_data(
        "",
        {
          params: {
            jsonStr: JSON.stringify({
              ownerId: row.stockId,
              startTime: $(".areaSearch .startTime").val(),
              endTime: $(".areaSearch .endTime").val()
            })
          },
          contentType: "application/x-www-form-urlencoded;charset=utf-8"
        },
        function(res) {
          $("#detailTable").bootstrapTable({
            striped: true, //是否显示行间隔色
            pagination: false, //是否分页,
            data: res,
            height: $("body").height() < 500 ? $("body").height() - 120 : 330,
            columns: [
              {
                title: "开支时间",
                field: "batchno"
              },
              {
                title: "开支的店铺",
                field: "ownerName"
              },
              {
                title: "开支名称",
                field: "categoryName"
              },
              {
                title: "开支金额",
                field: "amount"
              }
            ]
          });
          open_html("详情信息", "#detail", function() {});
        }
      );
    }
  };

  var userOperateEvents = {
    "click #userEdit": function(e, v, row) {
      open_html("修改信息", "#editUserData", function() {
        $("input").val();
      });
    },
    "click #userDetail": function(e, v, row) {
      ajax_data(
        "",
        {
          params: {
            jsonStr: JSON.stringify({
              ownerId: row.stockId,
              startTime: $(".areaSearch .startTime").val(),
              endTime: $(".areaSearch .endTime").val()
            })
          },
          contentType: "application/x-www-form-urlencoded;charset=utf-8"
        },
        function(res) {
          $("#userDetailTable").bootstrapTable({
            striped: true, //是否显示行间隔色
            pagination: false, //是否分页,
            data: res,
            height: $("body").height() < 500 ? $("body").height() - 120 : 330,
            columns: [
              {
                title: "开支时间",
                field: "batchno"
              },
              {
                title: "开支的店铺",
                field: "ownerName"
              },
              {
                title: "开支名称",
                field: "categoryName"
              },
              {
                title: "开支金额",
                field: "amount"
              }
            ]
          });

          open_html("详情信息", "#userDetail", function() {});
        }
      );
    }
  };

  function queryParams() {
    return {
      detailAddress: $(".detailAddress").val()
        ? $(".detailAddress").val()
        : undefined
    };
  }

  function queryUserRecord() {
    $("#userSalesRecord").bootstrapTable({
      method: "get",
      url: base + "../../testJson/storeManagement.json", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 20, //单页记录数
      height: $(window).height() - 150,
      pageList: [10, 20, 30], //可选择单页记录数
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      showLoading: true,
      height: $(window).height() - 150,
      queryParams: queryParams,
      columns: [
        {
          title: "录入时间",
          field: "operationDate"
        },
        {
          title: "销售员",
          field: "sellers"
        },
        {
          title: "店铺id",
          field: "storeId "
        },
        {
          title: "客户类型",
          field: "custType"
        },
        {
          title: "操作",
          field: "publicationTime",
          events: userOperateEvents,
          formatter: userOperation //对资源进行操作,
        }
      ]
    });
  }

  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    // recordType 0 店铺 1 个人
    if ($(".recordType input:checked").val() == "0") {
      $("#storeSalesRecord").bootstrapTable("refresh");
    } else {
      $("#userSalesRecord").bootstrapTable("refresh");
    }
  });
  $(".condition .closeBtn").on("click", function(params) {
    layer.close(layer.index);
  });

  $("#editData .condition .confirmBtn").on("click", function() {
    let params = {
      stockId: -1,
      operationDate: $(".operationDate").val(), //录入时间
      sellers: $(".sellers").val(), //销售员
      storeId: $(".storeId").val(), //店铺id
      totalAmount: $(".totalAmount").val(), //本次应付金额
      payedAmount: $(".payedAmount").val(), //本次实付金额
      custType: $(".custType").val() //客户类型
    };
    let url = "";
    url = "/inventory/modifySale";
    ajax_data(url, { params: JSON.stringify(params) }, function(res) {
      if (res.resultCode > -1) {
        layer.close(layer.index);
        $("#storeSalesRecord").bootstrapTable("refresh");
      } else {
        tips("修改信息失败", 5);
      }
    });
  });

  $("#editUserData .condition .confirmBtn").on("click", function() {
    let params = {
      stockId: -1,
      operationDate: $(".operationDate").val(), //录入时间
      sellers: $(".sellers").val(), //销售员
      storeId: $(".storeId").val(), //店铺id
      custType: $(".custType").val() //客户类型
    };
    let url = "";
    url = "/inventory/modifySale";
    ajax_data(url, { params: JSON.stringify(params) }, function(res) {
      if (res.resultCode > -1) {
        layer.close(layer.index);
        $("#userSalesRecord").bootstrapTable("refresh");
      } else {
        tips("修改信息失败", 5);
      }
    });
  });

  $(".recordType input[type='radio']").change(function() {
    if ($(this).val() == "0") {
      $(".storeSalesRecord").show();
      $(".userSalesRecord").hide();
    } else {
      $(".storeSalesRecord").hide();
      $(".userSalesRecord").show();
    }
  });

  // 导出
  $(".exportBtn").click(function() {
    let jsonStr = "hello word";
    let exportType = "";
    let form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "",
      method: "post"
    });
    $("<input>")
      .attr("name", "jsonStr")
      .val(jsonStr)
      .appendTo(form);
    $("<input>")
      .attr("name", "exportType")
      .val(exportType)
      .appendTo(form);
    $("body").append(form);
    $("#to_export")
      .submit()
      .remove();
  });
})(document, window, jQuery);
