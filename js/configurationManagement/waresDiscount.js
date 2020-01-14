(function(document, window, $) {
  "use strict";
  var isadd = false; // 判断是添加还是修改
  function initFn() {
    $("#waresDiscount").bootstrapTable({
      method: "post",
      url: base + "/configuration/queryDiscountInit", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
    
      pageSize: 10, //单页记录数
      pageList: [10, 20, 30], //可选择单页记录数
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      showLoading: true,
      height: $(window).height() - 150,
      queryParams: queryParams,
      contentType: "application/x-www-form-urlencoded",
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
          title: "商品进货折扣",
          formatter: function(value, row, index) {
            return `<div style="display:flex;align-items:center">
                        <input class="form-control ${"purchase" + row.waresId}"  value="${row.buyDiscount}" style="width:150px;margin-right:5px;">
                        </div>`;
          }
        },
        {
          title: "商品发货折扣",
          formatter: function(value, row) {
            return `<div style="display:flex;align-items:center">
                        <input class="form-control ${"ship" +row.waresId}" value="${row.sellDiscount}" style="width:150px;margin-right:5px;"><div>`;
          }
        }
      ]
    });
  }
  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#waresDiscount").bootstrapTable("refresh");
  });

  function queryParams() {
    return {};
  }
  // 点提交按钮
  $(".submitBtn").click(function() {
    var allTableData = $("#waresDiscount").bootstrapTable("getData");
    console.log(allTableData);
    let params = [];
    allTableData.forEach(function(item) {
      let obj = {
        waresId: item.waresId,
        waresName: item.waresName,
        buyDiscount: $(`.purchase${item.waresId}`).val().trim(),
        sellDiscount: $(`.ship${item.waresId}`).val().trim()
      };
      params.push(obj);
    });
    ajax_data("/configuration/modifyDiscount", { params:{jsonStr:JSON.stringify(params)},contentType: "application/x-www-form-urlencoded"}, function(res) {
      console.log(res);
      if (res.resultCode > -1) {
        tips("修改信息成功",6)
        $("#waresDiscount").bootstrapTable("refresh");
      } else {
        tips("提交失败", 5);
      }
    });
  });
})(document, window, jQuery);
