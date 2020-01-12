(function(document, window, $) {
  "use strict";
  var isadd = false; // 判断是添加还是修改
  function initFn() {
    $("#waresManagement").bootstrapTable({
      method: "post",
      url: base + "/configuration/queryWaresInfo", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 10, //单页记录数
      pageList: [10, 20, 30], //可选择单页记录数
      height: $(window).height() - 150,
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      showLoading: true,
      height: $(window).height() - 150,
      queryParams: queryParams,
      columns: [
        {
          title: "商品id",
          field: "waresId"
        },
        {
          title: "商品名称",
          field: "waresName"
        },
        {
          title: "商品分类",
          field: "categoryName"
        },
        {
          title: "商品价格",
          field: "waresPrice"
        },
        {
          title: "商品描述",
          field: "waresDesc"
        },
        {
          title: "操作",
          field: "publicationTime",
          events: operateEvents,
          formatter: operation //对资源进行操作,
        }
      ]
    });
    queryWaresCategory();
  }

  function operation(vlaue, row) {
    let purviewList = getQueryString("purview").split(",");
    let html = "";
    if (purviewList.includes("3")) {
      html += `<button type="button" id="edit" class="btn btn-info btn-sm editBtn">修改</button>`;
    }
    if (purviewList.includes("2")) {
      html +=`<button type="button" id="delete" class="btn btn-danger btn-sm deleteBtn">删除</button>`;
    }
    return html;
  }

  var operateEvents = {
    "click #edit": function(e, v, row) {
      isadd = false;
      $(".wares_name").val(row.waresName); // 名称
      $(".wares_name").attr("data-waresId", row.waresId); // 名称
      $(".category_name").val(row.categoryName); //商品分类
      $(".wares_price").val(row.waresPrice); //商品价格
      $(".wares_desc").val(row.waresDesc); //商品描述
      open_html("修改信息", "#editData");
    },
    "click #delete": function(e, v, row) {
      firm("提示", "是否删除", function() {
        layer.close(layer.index);
        ajax_data(
          "/configuration/deleteWaresInfo",
          {
            params: { waresId: row.waresId },
            contentType: "application/x-www-form-urlencoded"
          },
          function(res) {
            console.log(res);
            if (res.resultCode > -1) {
              tips("删除成功", 6);
            } else {
              tips("删除失败", 5);
            }
          }
        );
        $("#waresManagement").bootstrapTable("refresh"); //刷新url！
      });
    }
  };

  function queryParams() {
    return {
      waresName: $(".searchList .query_wares_name").val()
        ? $(".searchList .query_wares_name").val()
        : undefined,
      categoryName: $(".searchList .query_category_name").val()
        ? $(".searchList .query_category_name").val()
        : undefined
    };
  }
  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#waresManagement").bootstrapTable("refresh");
  });
  // 添加商品
  $(".addBtn").click(function() {
    isadd = true;
    open_html("添加商品", "#editData");
  });

  $(".condition .closeBtn").on("click", function(params) {
    layer.close(layer.index);
  });
  $(".condition .confirmBtn").on("click", function() {
    let params = {
      waresId: $(".wares_name").attr("data-waresId")
        ? $(".wares_name").attr("data-waresId")
        : -1,
      waresName: $(".wares_name").val(), // 名称
      categoryName: $(".category_name").val(), //商品分类名称
      waresPrice: $(".wares_price").val(), //商品价格
      waresDesc: $(".wares_desc").val() //商品描述
    };
    let url;
    if (isadd) {
      url = "/configuration/addWaresInfo";
    } else {
      url = "/configuration/modifyWaresInfo";
    }
    ajax_data(url, { params: JSON.stringify(params) }, function(res) {
      console.log(res);
      if (res.resultCode > -1) {
        layer.close(layer.index);
        $("#waresManagement").bootstrapTable("refresh");
      } else {
        let tipsText;
        if (isadd) {
          tipsText = "添加商品失败";
        } else {
          tipsText = "修改商品失败";
        }
        tips(tipsText, 5);
      }
    });
  });

  // 查询商品分类
  function queryWaresCategory() {
    ajax_data(
      "/configuration/queryWaresCategory",
      { params: JSON.stringify({}) },
      function(res) {
        let option = "<option value=''>选择商品分类</option>";
        res.forEach(function(element) {
          option += `<option value="${element}">${element}</option>`;
        });
        $(".query_category_name").html(option);
        $(".category_name").html(option);
      }
    );
  }
})(document, window, jQuery);
