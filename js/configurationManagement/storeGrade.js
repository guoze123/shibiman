(function(document, window, $) {
  "use strict";
  var storeType={

  }
  function initFn() {
    $("#storeGrade").bootstrapTable({
      method: "post",
      url: base + "/configuration/queryStoreLevel", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: false, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      height: $(window).height() - 150,
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      showLoading: true,
      contentType: "application/x-www-form-urlencoded",
     queryParams: queryParams,
      columns: [
        {
          title: "店铺等级类型",
          field: "levelName"
        },{
          title: "店铺类型",
          field: "storeType",
          formatter:function (value,row,index) {
           console.log(index);
            return (
              row.storeType== 0 ? "直营店":"加盟店"
            )
          }
        },
        {
          title: "店铺销售额",
          formatter: function(value, row,index) {
            return `<div style="display:flex;align-items:center">
             <input class="form-control minValue_${index}" value="${row.startValue ? row.startValue : ""}" style="width:150px;margin-right:5px;">——
              <input class="form-control maxValue_${index}" value="${row.endValue ? row.endValue : ""}" style="width:150px;margin-right:5px;">
            </div>`;
          }
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

  //查询条件
  function queryParams() {
    return {};
  }
  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#storeGrade").bootstrapTable("refresh");
  });
  $(".condition .closeBtn").on("click", function(params) {
    layer.closeAll("page");
  });
  // 添加或修改
  $(".storeType input[type='radio']").change(function(params) {
    $("#storeGrade").bootstrapTable("refresh");
  });

  $(".submitBtn").click(function() {
    var allTableData = $("#storeGrade").bootstrapTable("getData");
    console.log(allTableData);
    let params = [];
    allTableData.forEach(function(item,index) {
      let obj = {
        levelName: item.levelName,
        storeType: item.storeType,
        startValue:$(`.minValue_${index}`).val().trim(),
        endValue:$(`.maxValue_${index}`).val().trim(),
      };
      params.push(obj);
    });
    ajax_data(
      "/configuration/modifyStoreLevel",
      {
        params: { jsonStr: JSON.stringify(params) },
        contentType: "application/x-www-form-urlencoded"
      },
      function(res) {
        console.log(res);
        if (res.resultCode > -1) {
          tips("修改信息成功",6)
          $("#storeGrade").bootstrapTable("refresh");
        } else {
          tips("提交失败", 5);
        }
      }
    );
  });

})(document, window, jQuery);
