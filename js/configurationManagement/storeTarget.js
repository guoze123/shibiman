(function(document, window, $) {
  "use strict";
  function initFn() {
    $("#storeTarget").bootstrapTable({
      method: "get",
      // url: baseUrl + "/configuration/queryTargetInit", //请求路径
      url: "../../testJson/storeManagement.json", //请求路径
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
          title: "时间",
          field: "batchno"
        },
        {
          title: "店铺名称",
          field: "storeName"
        },
        {
          title: "店铺目标值",
         // events: operateEvents,
          formatter: function(value, row, index) {
            let str=`<div style="display:flex;align-items:center">
            <input class="form-control inputTargetValue ${"target" +
              row.storeId}" value="${
              row.targetValue ? row.targetValue : ""
            }" style="width:150px;margin-right:5px;" data-index="${index}">
            </div>`
            return str;
          }
        }
      ]
    });
  }
  function operation(vlaue, row) {
    var html = `
        <button type="button" id="edit" class="btn btn-info btn-sm editBtn" >修改</button>
        `;
    return html;
  }
  function queryParams() {
    return {
      jsonStr: JSON.stringify({
        storeName: $(".storeName").val() ? $(".storeName").val() : undefined
      })
    };
  }

  initFn();
  $("#storeTarget").on("input",".inputTargetValue",function(e) {
    console.log($(e.target).val());
    let row = $("#storeTarget").bootstrapTable('getOptions').data[$(e.target).attr("data-index")];
    row["targetValue"]=$(e.target).val();
    $("#storeTarget").bootstrapTable("updatarow",{index:$(e.target).attr("data-index"),row:row});
  })
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#storeTarget").bootstrapTable("refresh");
  });
  $(".condition .closeBtn").on("click", function(params) {
    layer.close(layer.index);
  });
  // 添加或修改
  $("#keepPaying .condition .confirmBtn").on("click", function() {
    let params = {
      storckId: $("#keepPaying .storckId").val(),
      storckName: $("#keepPaying .storckName").val()
    };
    ajax_data("", { params: JSON.stringify(params) }, function(res) {
      if (res.resultCode > -1) {
        layer.close(layer.index);
        $("#storeTarget").bootstrapTable("refresh");
      } else {
        tipe("修改信息失败", 5);
      }
    });
  });
  // 点击提交 保存修改的数据
  $(".submitBtn").click(function() {
    var allTableData = $("#storeTarget").bootstrapTable("getData");
    console.log(allTableData);
    let params = [];
    allTableData.forEach(function(item) {
      let obj = {
        storeId: item.storeId,
        targetValue: $(`.target${item.storeId}`).val()
      };
      params.push(obj);
    });
    ajax_data(
      "/configuration/modifyTargetValue",
      {
        params: { jsonStr: JSON.stringify(params) },
        contentType: "application/x-www-form-urlencoded"
      },
      function(res) {
        console.log(res);
        if (res.resultCode > -1) {
          tips("修改信息成功", 6);
          $("#storeTarget").bootstrapTable("refresh");
        } else {
          tips("提交失败", 5);
        }
      }
    );
  });
})(document, window, jQuery);
