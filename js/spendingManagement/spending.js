(function(document, window, $) {
  "use strict";
  var isadd = false;
  $(".query_startTime ,.query_endTime,.costTime").datepicker({
    
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
  
    format: "yyyy-mm-dd"
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
        {
          title: "发票",
          formatter:function(value,row){
            return `<img  class="viewImg" src="${base+"/uploadImgs/"+row.costId+".jpg"}"  style="width:50px;height:50px">`
          },
          events:{
            'click .viewImg':function(e,v,row){
              let url= base+"/uploadImgs/"+row.costId+".jpg";
              let image=new Image();
              image.src = url;
              image.onload = function() {
                var width = image.width;
                var height = image.height;
                if (width > height) {
                  height= (800 / width)*height
                  width=800;
                } else {
                  width=(500 / height)*width
                  height=500;
                }
                layer.open({
                  type: 1,
                  title: false,
                  closeBtn: 1,
                  area: [ width+"px",height+'px' ],
                  skin: 'layui-layer-nobg', //没有背景色
                  shadeClose: true,
                  content: `<img src="${url}" style="width:${width}px; height:${height}px "/>`
                });
              };
            }
          
          }
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
      // $("#editData img").attr("src",base+"/uploadImgs/"+row.costId+".jpg")
      // $("#editData img").attr("width","100px")
      isadd = false;
      open_html("修改信息", "#editData",function() {
        $("#editData input").val("");
        $("#editData select").val("");
        $("#editData img").attr("src","");
      },
      function() {
      confirmFn();
      },
      function() {
      closeFn();
      });
    }
  };
  //查询条件
  function queryParams() {
    return {
      jsonStr: JSON.stringify({
        startTime: $(".searchList .query_startTime").val().trim(),
        endTime: $(".searchList .query_endTime").val().trim(),
        costTypeId: $(".searchList .query_costTypeId").val().trim(),
        ownerName: $(".searchList .query_ownerName").val().trim()
      })
    };
  }

  initFn();

  document.addEventListener("error", function (event) {
    var ev= event||window.event;
    var elem = ev.target;
    if (elem.tagName.toLowerCase() == 'img') { 
      // 图片加载失败  --替换为默认 
      elem.src = base+"/pages/img/noImg.png"
    }
  }, true);
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
    },
    function() {
    confirmFn();
    },
    function() {
    closeFn();
    });
    //$(".costTypeId").chosen({});
  });
  $(".uploadimg").change(function() {
    uploadFile($(this));
  });
  function closeFn() {
    layer.closeAll("page");
  }

  function confirmFn() {
    let required = true;
    $(".required").parent().next().each(function() {
        if (!$(this).val().trim()) {
            required = false
        }
    })
    if (!required) {
        tips(requiredText, 5);
        return
    }
    let formdata = new FormData();
    let params = {
      costTime: $(".costTime").val().trim(),
      ownerId: $(".ownerId").val().trim(),
      costTypeId: $(".costTypeId").val().trim(),
      costAmount: $(".costAmount").val().trim(),
      remark: $(".remark").val().trim(),
      costId:$(".remark").attr("data_costId")
    };
    if($(".uploadimg")[0].files[0]){
      formdata.append("file", $(".uploadimg")[0].files[0]);
    }
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
        layer.closeAll("page");
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
  }

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
      action: base + "/common/exportWaresOrCostData",
      method: "post"
    });
    $("<input>")
      .attr("name", "type")
      .val("1")
      .appendTo(form);
      $("<input>")
      .attr("name", "jsonStr")
      .val(JSON.stringify({startTime:$(".query_startTime").val().trim(),endTime:$(".query_endTime").val().trim(),costTypeId: $(".costTypeId").val().trim(),ownerName: $(".searchList .query_ownerName").val().trim()}))
      .appendTo(form);
    $("body").append(form);
    $("#to_export")
      .submit()
      .remove();
  });
})(document, window, jQuery);
