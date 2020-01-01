(function(document, window, $) {
  "use strict";
  var url = "../../testJson/storeManagement.json";
  function initFn() {
    $("#storeGrade").bootstrapTable({
      method: "get",
      url: baseUrl + url, //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: false, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 10, //单页记录数
      pageList: [10, 20, 30], //可选择单页记录数
      height: $(window).height() - 150,
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      showLoading: true,
     // queryParams: queryParams,
      columns: [
        {
          title: "店铺等级类型",
          field: "storeGreade"
        },
        {
          title: "店铺销售额",
          field: "storeSales"
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
    var html = `
        <button type="button" id="edit" class="btn btn-info btn-sm editBtn">修改</button>
        `;
    return html;
  }
  var operateEvents = {
    "click #edit": function(e, v, row) {
      $(".storeGrade").val("");
      $(".storeSales").val("");
      open_html("修改信息", "#editData");
    }
  };
  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#storeGrade").bootstrapTable("refresh");
  });
  $(".condition .closeBtn").on("click", function(params) {
    layer.close(layer.index);
  });
  // 添加或修改
  $(".condition .confirmBtn").on("click", function() {
    let params = {
      storeGrade: $(".storeGrade").val(),
      storeSales: $(".storeSales").val()
    };
    ajax_data("", { params: JSON.stringify(params) }, function(res) {
      console.log(res);
      $("#storeGrade").bootstrapTable("refresh");
    });
  });

  $(".storeType input[type='radio']").change(function(params) {
    $("#storeGrade").bootstrapTable("refresh");
  });
})(document, window, jQuery);
