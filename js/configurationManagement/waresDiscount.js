(function(document, window, $) {
    "use strict";
    var isadd = false; // 判断是添加还是修改
    function initFn() {
      $("#waresDiscount").bootstrapTable({
        method: "get",
        //url: baseUrl + "/configuration/queryWaresInfo", //请求路径
        url: baseUrl + "../../testJson/storeManagement.json", //请求路径
        striped: true, //是否显示行间隔色
        pageNumber: 1, //初始化加载第一页
        pagination: false, //是否分页
        sidePagination: "client", //server:服务器端分页|client：前端分页
        height: $(window).height() - 150,
        showRefresh: false, //刷新按钮
        cache: true, // 禁止数据缓存
        search: false, // 是否展示搜索
        showLoading: true,
        height: $(window).height() - 150,
        //queryParams: queryParams,
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
            field: "",
            formatter:function (value,row) {
                return `<div style="display:flex;align-items:center">
                        <input class="form-control" value="" style="width:150px;margin-right:5px;"><i class="fa fa-edit" style="font-size:20px"><i>
                        </div>`
            }
          },
          {
            title: "商品发货折扣",
            field: "",
            formatter:function (value,row) {
                return `<div style="display:flex;align-items:center"><input value="" class="form-control" style="width:150px;margin-right:5px;"><i class="fa fa-edit" style="font-size:20px"><i><div>`
            }
          }
        ]
      });
      queryWaresCategory();
    }
  
  
    initFn();
    // 点击查询按钮
    $("#eventqueryBtn").click(function() {
      $("#waresDiscount").bootstrapTable("refresh");
    });
  })(document, window, jQuery);
  