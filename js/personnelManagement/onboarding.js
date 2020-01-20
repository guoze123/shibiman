function open_html1(title, ht_id, fn, yesFn, closeFn) {
  var h_w = "800px";
  var h_h = ($("body").height() < 500 ? $("body").height() - 40 : "500") + "px";
  layer.open({
    type: 1,
    title: title,
    maxmin: true,
    content: $(ht_id), //这里content
    area: [h_w, h_h],
    end: function() {
      // 销毁弹出时 执行
      if (!!fn) {
        fn();
      }
    },
    btn: ["确定", "取消"],
    yes: function(index, layero) {
      yesFn();
    },
    btn2: function(index, layero) {
      closeFn();
    }
  });
}
var employeeId="";

(function(document, window, $) {
  "use strict";
  var isadd = false;
  var allStroe = [];
  var allRole = [];

  function initFn() {
    $("#employeeInfo").bootstrapTable({
      method: "post",
      url: base + "/personnel/queryEmployeeInfo", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 10, //单页记录数
      pageList: [10, 20, 30], //可选择单页记录数
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      height: $(window).height() - 190,
      showLoading: true,
      queryParams: queryParams,
      columns: [
        {
          title: "员工工号",
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
          title: "简历",
          formatter: function(value, row) {
            return `<img  class="viewImg" src="${base +
              "/uploadImgs/" +
              row.phoneNumber +
              ".jpg"}"  style="width:50px;height:50px">`;
          },
          events: {
            "click .viewImg": function(e, v, row) {
              let url = base + "/uploadImgs/" + row.phoneNumber + ".jpg";
              let image = new Image();
              image.src = url;
              image.onload = function() {
                var width = image.width;
                var height = image.height;
                if (width > height) {
                  height = (800 / width) * height;
                  width = 800;
                } else {
                  width = (500 / height) * width;
                  height = 500;
                }
                layer.open({
                  type: 1,
                  title: false,
                  closeBtn: 1,
                  area: [width + "px", height + "px"],
                  skin: "layui-layer-nobg", //没有背景色
                  shadeClose: true,
                  content: `<img src="${url}" style="width:${width}px; height:${height}px "/>`
                });
              };
            }
          }
        },
        {
          title: "操作",
          field: "publicationTime",
          events: operateEvents,
          formatter: operation //对资源进行操作,
        }
      ]
    });

    queryCompetence();
    queryStore();
  }

  function operation(vlaue, row) {
    let purviewList = getQueryString("purview").split(",");
    let html = "";
    if (purviewList.includes("3")) {
      html += `<button type="button" id="edit" class="btn btn-info btn-sm editBtn">修改</button>`;
    }
    return html;
  }
  var operateEvents = {
    "click #edit": function(e, v, row) {
      isadd = false;
      employeeId=row.employeeId;
      $(".employeeName").val(row.employeeName); //姓名
      $(".employeeSex").val(row.employeeSex); //性别
      $(".identityNumber").val(row.identityNumber); //身份证
      $(".entryTime").val(row.entryTime); //入职时间
      $(".telephone").val(row.telephone); //电话
      $(".job").val(row.job); //职务
      //$(".role").val(row.role); //角色
      $(".address").val(row.address); //地址
      $(".activeStatus").val(row.activeStatus); //状态 在离
      $(".education").val(row.education); // 学历8
      $(".ownerId").val(`${row.ownerId}`); //店铺id
      open_html1(
        "修改信息",
        "#editData",
        function() {
          $("#editData input").val("");
          $("#editData select").val("");
          $("#editData img").attr("src", "");
        },
        function() {
          confirmBtn();
        },
        function() {
          layer.closeAll("page");
        }
      );

      $(".ownerId").chosen();
    }
  };

  function queryParams() {
    return {
      employeeId: $(".query_employeeId")
        .val()
        .trim()
        ? $(".query_employeeId")
            .val()
            .trim()
        : undefined,
      employeeName: $(".query_employeeName")
        .val()
        .trim()
        ? $(".query_employeeName")
            .val()
            .trim()
        : undefined, //姓名
      ownerId: $(".query_ownerId")
        .val()
        .trim()
        ? $(".query_ownerId")
            .val()
            .trim()
        : undefined,
      activeStatus: $(".query_activeStatus")
        .val()
        .trim()
        ? $(".query_activeStatus")
            .val()
            .trim()
        : undefined
    };
  }
  initFn();

  document.getElementById("employeeInfo").addEventListener(
    "error",
    function(event) {
      var ev = event || window.event;
      var elem = ev.target;
      if (elem.tagName.toLowerCase() == "img") {
        // 图片加载失败  --替换为默认
        elem.src = base + "/pages/img/noImg.png";
        $(elem).css({
          visibility:"hidden"
        })
      }
    },
    true
  );

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
    open_html1(
      "添加人员",
      "#editData",
      function(params) {
        $("#editData input").val("");
        $("#editData select").val("");
        $("#editData img").attr("src", "");
      },
      function() {
        confirmBtn();
      },
      function() {
        layer.closeAll("page");
      }
    );
    $(".ownerId").chosen();
  });

  function confirmBtn() {
    let required = true;
    $(".required")
      .parent()
      .next()
      .each(function() {
        if (
          !$(this)
            .val()
            .trim()
        ) {
          required = false;
        }
      });
    if (!required) {
      tips(requiredText, 5);
      return;
    }
    let params = {
      employeeId: isadd?undefined:employeeId,
      employeeName: $(".employeeName")
        .val()
        .trim(), //姓名
      employeeSex: $(".employeeSex")
        .val()
        .trim(), //性别
      identityNumber: $(".identityNumber")
        .val()
        .trim(), //身份证
      entryTime: $(".entryTime")
        .val()
        .trim(), //入职时间
      telephone: $(".telephone")
        .val()
        .trim(), //电话
      job: $(".job")
        .val()
        .trim(), //职务
      role: $(".role")
        .val()
        .trim(), //角色
      ownerId: $(".ownerId")
        .val()
        .trim(), //店铺id
      address: $(".address")
        .val()
        .trim(), //地址
      activeStatus: $(".activeStatus")
        .val()
        .trim(), //状态 在离
      education: $(".education")
        .val()
        .trim() // 学历
    };
    let formdata = new FormData();
    if ($(".uploadimg")[0].files[0]) {
      formdata.append("file", $(".uploadimg")[0].files[0]);
    }
    formdata.append("jsonStr", JSON.stringify(params));
    let url;
    if (isadd) {
      url = "/personnel/addEmployeeInfo";
    } else {
      url = "/personnel/modifyEmployeeInfo";
    }

    file_upload(url, formdata, function(res) {
      console.log(res);
      if (res.resultCode > -1) {
        layer.closeAll("page");
        $("#employeeInfo").bootstrapTable("refresh");
      } else {
        let tipsText;
        if (isadd) {
          tipsText = "添加人员信息失败";
        } else {
          tipsText = "修改人员信息失败";
        }
        tips(tipsText, 5);
      }
    });
  }

  // 查找角色
  function queryCompetence() {
    ajax_data(
      "/common/getCompetence",
      { params: {}, contentType: "application/x-www-form-urlencoded" },
      function(res) {
        console.log(res);
        let option = "<option value=''>选择角色</option>";
        res.obj.forEach(function(element) {
          option += `<option value="${element.id}">${element.name}</option>`;
        });

        allRole = res.obj;
        $(".role").html(option);
        $(".query_role").html(option);
      }
    );
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
        allStroe = res;
        $(".query_ownerId").html(option);
        $(".ownerId").html(option);
        $(".query_ownerId").chosen();
        $(".ownerId").chosen();
      }
    );
  }
})(document, window, jQuery);
