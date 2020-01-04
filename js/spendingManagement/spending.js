(function(document, window, $) {
  "use strict";
  var isadd = false;
  $(".query_startTime ,.query_endTime").datepicker({
    startView: 1,
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    minViewMode: 1,
    format: "yyyy-mm"
  });
  function initFn() {
    $("#spending").bootstrapTable({
      method: "get",
      url: baseUrl + "/cost/queryCost", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 5, //单页记录数
      pageList: [10, 20, 30], //可选择单页记录数
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      height:$(window).height()-150,
      showLoading: true,
      queryParams: queryParams,
      columns: [
        {
          title: "开支id",
          field: "costId"
        },
        {
          title: "开支时间",
          field: "costTime"
        },
        {
          title: "开支的店铺",
          field: "ownerId"
        },
        {
          title: "开支类型",
          field: "costTypeId"
        },
        {
          title: "开支金额",
          field: "costAmount"
        },
        {
          title: "发票截图",
          field: "receiptPic"
        },
        {
          title: "备注信息",
          field: "remark"
        },
        {
          title: "操作",
          field: "publicationTime",
          events: operateEvents,
          formatter: operation //对资源进行操作,
        }
      ]
    });
    queryCostType();
    queryDepartment();
  }

  function operation(vlaue, row) {
    var html = `
      <button type="button" id="edit" class="btn btn-info btn-sm editBtn">修改</button>
      `;
    return html;
  }
  var operateEvents = {
    "click #edit": function(e, v, row) {
      $(".costTime").val(row.costTime);
      $(".ownerId").val(row.ownerId);
      $(".costTypeId").val(row.costTypeId);
      $(".costAmount").val(row.costAmount);
      $(".receiptPic").val(row.receiptPic);
      $(".remark").val(row.remark);
      isadd = false;
      open_html("修改信息", "#editData");
    }
  };
  //查询条件
  function queryParams() {
    return {
      costTime: $(".areaSearch .query_costTime").val()
        ? $(".areaSearch .query_costTime").val()
        : undefined, // 开支时间
      costTypeId: $(".areaSearch .query_costTypeId").val()
        ? $(".areaSearch .query_costTypeId").val()
        : undefined, // 开支分类id
      ownerId: $(".areaSearch .query_ownerName").val()
        ? $(".areaSearch .query_ownerName").val()
        : undefined // 部门id
    };
  }

  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#spending").bootstrapTable("refresh");
  });

  $(".addBtn").click(function() {
    isadd = true;
    open_html("添加开支", "#editData", function() {
      $("input").val("");
      $("select").val("");
    });
  });

  $(".uploadimg").change(function() {
    uploadFile($(this));
  });
  $(".condition .closeBtn").on("click", function(params) {
    layer.close(layer.index);
  });
  // 添加或修改
  $(".condition .confirmBtn").on("click", function() {
    let formdata = new FormData();
    let params = {
      costTime: $(".costTime").val(),
      ownerId: $(".ownerId").val(),
      costTypeId: $(".costTypeId").val(),
      costAmount: $(".costAmount").val(),
      remark: $(".remark").val()
    };
    formdata.append("file", $(".uploadimg")[0].files[0]);
    formdata.append("jsonStr", JSON.stringify(params));
    let url;
    if (isadd) {
      url = "/cost/addCost";
    } else {
      url = "/cost/modifyCost";
    }
    file_upload(url, formdata, function(res) {
      console.log(res);
      if(res.resltCode>-1){
        layer.close(layer.index);
        $("#spending").bootstrapTable("refresh");
      }else{
        let tipsText;
        if(isadd){
          tipsText="添加开支信息失败"
        }else{
          tipsText="修改开支信息失败"
        }
        tips(tipsText,5)
      }
    });
  });
  // 查询所有部门
  function queryDepartment() {
    ajax_data("", { params: JSON.stringify({}) }, function(res) {
      let option = "<option value=''>选择部门</option>";
      res.forEach(function(element) {
        option += `<option value="${element}">${element}</option>`;
      });
      $(".query_costTypeId").html(option);
      $(".costTypeId").html(option);
    });
  }

  // 开支分类
  function queryCostType() {
    let params = {
      //     categoryName: ""
    };
    ajax_data(
      "/cost/queryCostCategory",
      { params: JSON.stringify(params) },
      function(res) {
        let option = "<option value=''>开支分类</option>";
        res.forEach(function(element) {
          option += `<option value="${element}">${element}</option>`;
        });
        $(".query_costTypeId").html(option);
        $(".query_costTypeId").chosen({});
        $(".costTypeId").html(option);
        $(".costTypeId").chosen({});
      }
    );
  }
})(document, window, jQuery);
