(function(document, window, $) {
  "use strict";
  var isadd = false;
  function initFn() {
    $("#employeeInfo").bootstrapTable({
      method: "post",
      url: base + "/personnel/queryEmployeeInfo", //请求路径
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
          title: "员工id",
          field: "employeeId"
        },
        {
          title: "员工姓名",
          field: "employeeName"
        },
        {
          title: "性别",
          field: "employeeSex"
        },
        {
          title: "身份证号",
          field: "identityNumber"
        },
        {
          title: "入职时间",
          field: "entryTime"
        },
        {
          title: "电话",
          field: "telephone"
        },
        {
          title: "职务名称",
          field: "job"
        },
        {
          title: "操作",
          field: "publicationTime",
          events: operateEvents,
          formatter: operation //对资源进行操作,
        }
      ]
    });

   // queryCompetence();
    queryStore();
  }

  function operation(vlaue, row) {
    let purviewList = getQueryString("purview").split(",");
    let html = "";
    if (purviewList.includes("3")) {
      html += `<button type="button" id="edit" class="btn btn-info btn-sm editBtn">修改</button>`;
    }
    return html
  }
  var operateEvents = {
    "click #edit": function(e, v, row) {
      isadd = false;
      $(".employeeId").val(row.employeeId); //员工id
      $(".employeeName").val(row.employeeName); //姓名
      $(".employeeSex").val(row.employeeSex); //性别
      $(".identityNumber").val(row.identityNumber); //身份证
      $(".entryTime").val(row.entryTime); //入职时间
      $(".telephone").val(row.telephone); //电话
      $(".job").val(row.job); //职务
      $(".role").val(row.role); //角色
      $(".ownerId").val(row.ownerId);//店铺id
      $(".address").val(row.address);//地址
      $(".activeStatus").val(row.activeStatus); //状态 在离
      $(".education").val(row.education) // 学历8 
      open_html("修改信息", "#editData");
    }
  };
  function queryParams(params) {
    return {
      employeeId: $(".query_employeeId").val()?$(".query_employeeId").val():undefined,
      employeeName: $(".query_employeeName").val()?$(".query_employeeName").val():undefined, //姓名
      ownerId: $(".query_ownerId").val()?$(".query_ownerId").val():undefined,
      activeStatus: $(".query_activeStatus").val()?$(".query_activeStatus").val():undefined
    };
  }
  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#employeeInfo").bootstrapTable("refresh");
  });

  $(".uploadimg").change(function() {
    uploadFile($(this));
  });
  // 添加人员
  $(".addBtn").click(function() {
    isadd = true;
    open_html("添加人员", "#editData",function(params) {
      $("#editData input").val("");
      $("#editData select").val("");
      $("#editData img").attr("src","");
    });
  });

  $(".condition .closeBtn").on("click", function(params) {
    layer.close(layer.index);
  });
  $(".condition .confirmBtn").on("click", function() {
    let params = {
      employeeId: $(".employeeId").val(), //员工id
      employeeName: $(".employeeName").val(), //姓名
      employeeSex: $(".employeeSex").val(), //性别
      identityNumber: $(".identityNumber").val(), //身份证
      entryTime: $(".entryTime").val(), //入职时间
      telephone: $(".telephone").val(), //电话
      job: $(".job").val(), //职务
      role: $(".role").val(), //角色
      ownerId: $(".ownerId").val(), //店铺id
      address: $(".address").val(), //地址
      activeStatus: $(".activeStatus").val(), //状态 在离
      education:$(".education").val() // 学历
    };
    let formdata = new FormData();
    formdata.append("file", $(".uploadimg")[0].files[0]);
    formdata.append("jsonStr", JSON.stringify(params));
    let url;
    if (isadd) {
      url = "/personnel/addEmployeeInfo";
    } else {
      url = "/personnel/modifyEmployeeInfo";
    }
    file_upload(url, formdata, function(res) {
      console.log(res);
      if(res.resultCode > -1){
        layer.close(layer.index);
        $("#employeeInfo").bootstrapTable("refresh");
      }else{
        let tipsText;
        if(isadd){
          tipsText="添加人员信息失败"
        }else{
          tipsText="修改人员信息失败"
        }
        tips(tipsText,5)
      }
    });
  });

  // 查找角色
  function queryCompetence() {
    ajax_data("/common/getCompetence", { params: JSON.stringify({}) }, function(
      res
    ) {
      console.log(res);
      let option = "<option value=''>选择角色 </option>";
      res.forEach(function(element) {
        option += `<option value="${element}">${element}</option>`;
      });
      $(".role").html(option);
      $(".query_role").html(option);
    });
  }

  // 查找门店
  function queryStore(params) {
    ajax_data(
      "/competence/queryStoreInfo",
      { params: JSON.stringify({}) },
      function(res) {
        console.log(res);
        let option = "<option value=''>选择店铺</option>";
        res.forEach(function(element) {
          option += `<option value="${element.storeId}">${element.storeName}</option>`;
        });
        $(".query_ownerId").html(option);
        $(".ownerId").html(option);
        // $(".query_ownerId").chosen();
        // $(".ownerId").chosen();
      }
    );
  }
})(document, window, jQuery);
