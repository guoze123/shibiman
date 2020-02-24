(function(document, window, $) {
  "use strict";

  var store_type = { "1": "直营店", "2": "加盟店" };
  var store_status = { "0": "待定", "1": "营业", "-1": "停业" };
  var isadd = false; // 判断是添加还是修改
  var storeId = "";
  function initFn() {
    down_list(
      ".queryStoreManager",
      "/personnel/queryEmployeeInfo",
      "选择店长",
      "telephone"
    );
    $("#exampleTableFromData").bootstrapTable({
      method: "post",
      url: base + "/competence/queryStoreInfo", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 10, //单页记录数
      pageList: [10, 20, 30], //可选择单页记录数
      height: $(window).height() - 150,
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索，
      queryParams: queryParams,
      columns: [
        {
          title: "店铺名称",
          field: "storeName"
        },
        {
          title: "开店时间",
          field: "openTime"
        },
        {
          title: "店铺类型",
          field: "storeType",
          formatter: function(vlaue, row) {
            return store_type[row.storeType];
          }
        },
        {
          title: "店长名称",
          field: "storeManager"
        },
        {
          title: "店铺状态",
          field: "openStatus",
          formatter: function(value, row) {
            return store_status[row.openStatus];
          }
        },
        {
          title: "操作",
          field: "publicationTime",
          events: operateEvents,
          formatter: operation
        }
      ]
    });
  }
  function operation(vlaue, row) {
    let purviewList = getQueryString("purview").split(",");
    let html = "";

    if (purviewList.includes("3")) {
      html += `<button type="button" id="edit" class="btn btn-info btn-sm editBtn" >修改</button>`;
    }
    if (purviewList.includes("2")) {
      html += `<button type="button" id="delete" class="btn btn-danger btn-sm deleteBtn">删除</button>`;
    }
    return html;
  }
  var operateEvents = {
    "click #edit": function(e, v, row) {
      isadd = false;
      storeId = row.storeId;
      $(".store_name").val(row.storeName);
      $(".open_time").val(row.openTime);
      $(".store_type").val(row.storeType);
      $(".selectedValue input").attr("data-id", row.managerId);
      $(".selectedValue input").val(row.storeManager);
      $(".params_province").val(row.provinceId);
      $(".params_province").trigger("change");
      $(".params_city").val(row.cityId);
      $(".params_city").trigger("change");
      $(".params_area").val(row.areaId);
      $(".open_status").val(row.openStatus);
      $(".detailAddress").val(row.address);
      open_html(
        "修改店铺信息",
        "#editData",
        function() {
          $("#editData input").val("");
          $("#editData select").val("");
        },
        function() {
          confirmFn();
        },
        function() {
          closeFn();
        }
      );
    },
    "click #delete": function(e, v, row) {
      firm("提示", "是否删除", function() {
        layer.closeAll("page");
        ajax_data(
          "/competence/deleteStoreInfo",
          {
            params: { storeId: row.storeId },
            contentType: "application/x-www-form-urlencoded;charset=utf-8"
          },
          function(res) {
            console.log(res);
            if (res.resultCode > -1) {
              tips("删除成功", 6);
              $("#exampleTableFromData").bootstrapTable("refresh"); //刷新url！
            } else {
              tips("删除失败", 5);
            }
          }
        );
      });
    }
  };

  function queryParams() {
    return {
      provinceId: $(".params_province")
        .val()
        .trim()
        ? $(".params_province")
            .val()
            .trim()
        : undefined,
      cityId: $(".params_city")
        .val()
        .trim()
        ? $(".params_city")
            .val()
            .trim()
        : undefined,
      areaId: $(".params_area")
        .val()
        .trim()
        ? $(".params_area")
            .val()
            .trim()
        : undefined,
      storeName: $(".query_StoreName")
        .val()
        .trim()
        ? $(".query_StoreName")
            .val()
            .trim()
        : undefined
    };
  }
  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#exampleTableFromData").bootstrapTable("refresh");
  });
  window.onload=function(params) {
    $("#exampleTableFromData").bootstrapTable("refresh");
  }

  $(".addBtn").click(function() {
    isadd = true;
    open_html(
      "添加店铺",
      "#editData",
      function() {
        $("#editData input").val("");
        $("#editData select").val("");
      },
      function() {
        confirmFn();
      },
      function() {
        closeFn();
      }
    );
  });
  // 修改信息
  function closeFn(params) {
    layer.closeAll("page");
  }
  function confirmFn() {
    let required = true;
    $(".required")
      .parent()
      .next()
      .each(function() {
        if (
          !$(this)
            .val()
            .trim()
        ) {
          required = false;
        }
      });
    if (!required) {
      tips(requiredText, 5);
      return;
    }
    if (!!!$(".manager .selectedValue input").val()) {
      tips(requiredText, 5);
      return;
    }
    if (
      $(".params_province").val() == "" ||
      $(".params_city").val() == "" ||
      $(".params_area").val() == ""
    ) {
      tips(requiredText, 5);
      return;
    }
    let params = {
      storeId: storeId || -1,
      storeName: $(".store_name")
        .val()
        .trim(),
      openTime: $(".open_time")
        .val()
        .trim(),
      storeType: $(".store_type")
        .val()
        .trim(),
      storeManager: $(".selectedValue input")
        .val()
        .trim(),
      managerId: $(".selectedValue input").attr("data-id"),
      provinceId: $(".params_province")
        .val()
        .trim(),
      cityId: $(".params_city")
        .val()
        .trim(),
      areaId: $(".params_area")
        .val()
        .trim(),
      openStatus: $(".open_status")
        .val()
        .trim(),
      detailAddress: $(".detailAddress")
        .val()
        .trim()
    };
    let url = "";
    if (isadd) {
      url = "/competence/addStoreInfo";
    } else {
      url = "/competence/modifyStoreInfo";
    }
    ajax_data(url, { params: JSON.stringify(params) }, function(res) {
      console.log(res);
      if (res.resultCode > -1) {
        layer.closeAll("page");
        $("#exampleTableFromData").bootstrapTable("refresh");
      } else {
        let tipsText;
        if (isadd) {
          tipsText = "添加店铺失败";
        } else {
          tipsText = "修改店铺失败";
        }
        tips(tipsText, 5);
      }
    });
  }
  queryProvince();
  // 查询省份
  function queryProvince() {
    ajax_data("/configuration/queryProvince", { params: {} }, function(res) {
      var option = '<option value="">选择省份</option>';
      for (let i in res) {
        option += `<option value="${res[i].id}">${res[i].name}</option>`;
      }
      $(".query_province").html(option);
      $(".params_province").html(option);
    });
  }
  // 查询市
  function queryCity(dom, params) {
    ajax_data(
      "/configuration/queryCity",
      { params: params, async: false,contentType: "application/x-www-form-urlencoded"},
      function(res) {
        var option = '<option value="">选择城市</option>';
        for (let i in res) {
          option += `<option value="${res[i].id}">${res[i].name}</option>`;
        }
        $(dom).html(option);
        $(dom).change(function() {
          if (
            $(this)
              .val()
              .trim() == ""
          ) {
            $(this)
              .next()
              .html('<option value="">选择区县</option>');
          }
          let newParams = params;
          newParams["cityId"] = parseInt($(this)
          .val()
          .trim());
          queryCounty($(this).next(), newParams);
        });
      }
    );
  }

  // 查询区县
  function queryCounty(dom, params) {
    ajax_data(
      "/configuration/queryArea",
      { params: params, async: false, contentType: "application/x-www-form-urlencoded"},
      function(res) {
        var option = '<option value="">选择区县</option>';
        for (let i in res) {
          option += `<option value="${res[i].id}">${res[i].name}</option>`;
        }
        dom.html(option);
      }
    );
  }
  $(".query_province").change(function() {
    if (
      $(this)
        .val()
        .trim() == ""
    ) {
      $(".query_city,.query_county").val("");
      $(".query_city,.query_county").attr("disabled", true);
    } else {
      $(".query_city,.query_county").attr("disabled", false);
    }
    queryCity(".query_city", {
      provinceId: parseInt($(this)
      .val()
      .trim())
    });
  });
  $(".params_province").change(function() {
    if (
      $(this)
        .val()
        .trim() == ""
    ) {
      $(".params_city,.params_area").val("");
      $(".params_city,.params_area").attr("disabled", true);
    } else {
      $(".params_city,.params_area").attr("disabled", false);
    }
    queryCity(".params_city", {
      provinceId:  parseInt($(this)
      .val()
      .trim())
    });
  });
})(document, window, jQuery);
