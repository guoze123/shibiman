(function(document, window, $) {
  "use strict";
  var isadd = false;
  $(".query_startTime ,.query_endTime,.costTime").datepicker({
    startView: 1,
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    minViewMode: 1,
    format: "yyyy-mm"
  });
  function initFn() {
    queryCostType();
    queryDepartment();
    $("#spending").bootstrapTable({
      method: "post",
      url: base + "/cost/queryCost", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 10, //单页记录数
      pageList: [10, 20, 30], //可选择单页记录数
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      height: $(window).height() - 150,
      showLoading: true,
      queryParams: queryParams,
      contentType: "application/x-www-form-urlencoded",
      columns: [
        // {
        //   title: "开支id",
        //   field: "costId"
        // },
        {
          title: "开支时间",
          field: "costTime"
        },
        {
          title: "开支的店铺id",
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
        // {
        //   title: "发票截图",
        //   field: "receiptPic",
        //   formatter:function (vlaue,row) {
        //     return ` <img src="" style="width: 50px; height: 50px" data-action="zoom"> `
        //   }
        // },
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
   
  }

  function operation(vlaue, row) {
    let purviewList = getQueryString("purview").split(",");
    let html = "";
    if (purviewList.includes("3")) {
      html += ` <button type="button" id="edit" class="btn btn-info btn-sm editBtn">修改</button>`;
    }
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
      $(".remark").attr("data_costId",row.costId);
      $("#editData img").attr("src",base+"/uploadImgs/"+row.costId+".jpg")
      $("#editData img").attr("width","100px")
      isadd = false;
      open_html("修改信息", "#editData",function() {
        $("#editData input").val("");
        $("#editData select").val("");
        $("#editData img").attr("src","");
      });
    }
  };
  //查询条件
  function queryParams() {
    return {
      jsonStr: JSON.stringify({
        startTime: $(".searchList .query_startTime").val(),
        endTime: $(".searchList .query_endTime").val(),
        costTypeId: $(".searchList .query_costTypeId").val(),
        ownerName: $(".searchList .query_ownerName").val()
      })
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
      $("#editData input").val("");
      $("#editData select").val("");
      $("#editData img").attr("src","")
    });
    //$(".costTypeId").chosen({});
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
      remark: $(".remark").val(),
      costId:$(".remark").attr("data_costId")
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
      if (res.resultCode > -1) {
        layer.close(layer.index);
        $("#spending").bootstrapTable("refresh");
      } else {
        let tipsText;
        if (isadd) {
          tipsText = "添加开支信息失败";
        } else {
          tipsText = "修改开支信息失败";
        }
        tips(tipsText, 5);
      }
    });
  });
  // 查询所有部门
  function queryDepartment() {
    ajax_data(
      "/competence/queryDepartment",
      { params: JSON.stringify({}) },
      function(res) {
        let option = "<option value=''>选择部门</option>";
        res.forEach(function(element) {
          option += `<option value="${element.departmentId}">${element.departmentName}</option>`;
        });
        $(".ownerId").html(option);
      }
    );
  }

  // 开支分类
  function queryCostType() {
    let params = {
      categoryName: ""
    };
    ajax_data(
      "/cost/queryCostCategory",
      { params: JSON.stringify(params),async:false},
      function(res) {
        let option = "<option value=''>开支分类</option>";
        res.forEach(function(element) {
          option += `<option value="${element}">${element}</option>`;
        });
        $(".query_costTypeId").html(option);
        $(".query_costTypeId").chosen({});
        $(".costTypeId").html(option);
      }
    );
  }

   // 导出
   $(".exportBtn").click(function() {
    let form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "/common/exportStoreTargetTemplate",
      method: "post"
    });
    $("<input>")
      .attr("name", "batchno")
      .val("")
      .appendTo(form);
    $("body").append(form);
    $("#to_export")
      .submit()
      .remove();
  });
})(document, window, jQuery);
