var allwares = ""; //所有商品
(function(document, window, $) {
  var isadd = false;

  function initFn() {
    queryWaresInfo();
    $("#importInventory").bootstrapTable({
      method: "post",
      url: baseUrl + "/inventory/queryEntryStock", //请求路径
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
      columns: [
        {
          title: " 日期",
          field: "operationDate"
        },
        {
          title: "订单号",
          field: "ordernum"
        },
        {
          title: "应付金额",
          field: "amount"
        },
        {
          title: "实付金额",
          field: "payedAmount"
        },
        {
          title: "备注",
          field: "remark"
        },
        {
          title: "发票",
          field: "picList"
        },
        {
          title: "操作",
          field: "publicationTime",
          events: operateEvents,
          formatter: operation //对资源进行操作,
        }
      ]
      // exportDataType: "all", //basic', 'all', 'selected'.
      // exportOptions: {
      //     fileName: "入库数据", //文件名称设置
      //     worksheetName: "sheet1", //表格工作区名称
      //     tableName: "数据",
      //     excelstyles: [
      //         "background-color",
      //         "color",
      //         "font-size",
      //         "font-weight",
      //         "border-top"
      //     ]
      // },
      // showExport: true, //是否显示导出按钮
      // buttonsAlign: "right", //按钮位置
      // exportTypes: ["csv"] //导出文件类型
    });
  }

  function operation(vlaue, row) {
    var html = `
      <button type="button" id="edit" class="btn btn-info btn-sm editBtn">修改</button>
      <button type="button" id="detail" class="btn btn-primary btn-sm editBtn">详情</button>
      `;
    return html;
  }
  var operateEvents = {
    "click #edit": function(e, v, row) {
      isadd = false;
      $(".startTime").val(row.operationDate); // 日期
      $(".ordernum").val(row.ordernum); //订单号
      $(".handleAmount").val(row.totalAmount); // 应付
      $(".actualAmount").val(row.payedAmount); // 实付
      $(".remark").val(row.remark); // 备注
      if (row.waresList.lenght == 1) {
        $(".firstGroup")
          .find(".name")
          .val();
        $(".firstGroup")
          .find(".name")
          .val();
      }
      if (row.waresList.lenght > 1) {
        let str = "";
        for (let i = 1; i < row.waresList.lenght; i++) {
          str += `
                            <div class="list_row commodity newShop">
                    <div style="width: 100%;">
                    <span>商品名称</span>
                    <input type="text" placeholder="商品名称" class="form-control name" vlaue="${row.waresList[i].waresName}">
                    <span style="margin-left: 10px;">商品数量</span>
                    <input type="text" placeholder="商品数量" class="form-control number"vlaue="${row.waresList[i].waresCount}">
                    <button style=" margin-left: 10px;" onclick="deleteCommodity(this)">删除商品</button>
                    </div></div>
                            `;
        }
        $(".firstGroup").after(str);
      }
      open_html("修改信息", "#editData", function(params) {
        $(".newShop").remove();
      });
    },
    "click #detail": function(e, v, row) {
      ajax_data(
        "",
        { params: JSON.stringify({ stockId: row.stockId }) },
        function(res) {
          open_html("详情信息", "#detail", function() {});
        }
      );
    }
  };

  function queryParams(params) {
    return {
      startTime: $("query_startTime").val()
        ? $("query_startTime").val()
        : undefined,
      ordernum: $(".query_ordernum").val()
        ? $(".query_ordernum").val()
        : undefined
    };
  }

  $(".addBtn").click(function() {
    isadd = true;
    open_html("添加", "#editData", function(params) {
      $("input").val("");
      $("select").val("");
      $(".newShop").remove();
      $("img").attr("src", "");
    });
  });
  initFn();
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#importInventory").bootstrapTable("refresh");
  });
  // 上传图片
  $(".uploadimg").change(function() {
    uploadFile($(this));
  });
  $(".condition .closeBtn").on("click", function(params) {
    layer.close(layer.index);
  });
  // 添加或修改
  $(".condition .confirmBtn").on("click", function() {
    let waresList = [];
    $(".commodity").each(function() {
      let wares = {};
      wares["waresName"] = $(this)
        .find(".name")
        .val();
      wares["waresCount"] = $(this)
        .find(".number")
        .val();
      wares["waresId"] = $(this)
        .find(".name option:selected")
        .attr("data-id");
      wares["isGift"] = 0;
      waresList.push(wares);
    });

    let params = {
      startTime: $(".startTime").val(), // 日期
      ordernum: $(".ordernum").val(), //订单号
      totalAmount: $(".handleAmount").val(), // 应付
      payedAmount: $(".actualAmount").val(), // 实付
      remark: $(".remark").val(), // 备注
      entryType: 0,
      waresList: waresList,
      fromStoreId: -1,
      toStoreId: 0
    };
    let formdata = new FormData();
    formdata.append("jsonStr", JSON.stringify(params));
    formdata.append(
      "file",
      $(".uploadimg")[0].files[0] ? $(".uploadimg")[0].files[0] : undefined
    );
    let url;
    if (isadd) {
      url = "/inventory/submitEntryStock";
    } else {
      url = "/inventory/modifyEntryStock";
    }
    file_upload(url, formdata, function(res) {
      console.log(res);
      if (res.resultCode > -1) {
        layer.close(layer.index);
        $("#importInventory").bootstrapTable("refresh");
      } else {
        let tipsText;
        if (isadd) {
          tipsText = "入库失败";
        } else {
          tipsText = "修改信息失败";
        }
        tips(tipsText, 5);
      }
    });
  });
// bootstrap 的导出功能
//   $(".exportBtn").click(function() {
//     $(".export.btn-group").click();
//   });

  $(".exportBtn").click(function() {
      let jsonStr="hello word";
      let exportType="";
    let form = $('<form id="to_export" style="display:none"></form>').attr({
      action: baseUrl + "",
      method: "post"
    });
    $("<input>")
      .attr("name", "jsonStr")
      .val(jsonStr)
      .appendTo(form);
    $("<input>")
      .attr("name", "exportType")
      .val(exportType)
      .appendTo(form);
    $("body").append(form);
    $("#to_export").submit().remove();
  });
})(document, window, jQuery);

function addCommodity(that) {
  // <input type="text" placeholder="商品名称" class="form-control name">
  // <select class="form-control name"></select>
  let option = "<option value=''>选择商品名称</option>";
  if (allwares.lenght) {
    allwares.forEach(function(item, index) {
      option += `<option value="${item.waresName}" data-id="${item.waresId}">${item.waresName}</option>`;
    });
  }

  let strHtml = `<div class="list_row commodity newShop">
            <div style="width: 100%;">
            <span>商品名称</span>
            <select class="form-control name">
            ${option}
            </select>
            <span style="margin-left: 10px;">商品数量</span>
            <input type="text" placeholder="商品数量" class="form-control number">
            <button style=" margin-left: 10px;" onclick="deleteCommodity(this)">删除商品</button>
            </div></div>
              `;
  $(that)
    .parent()
    .parent()
    .after(strHtml);
}

function deleteCommodity(that) {
  $(that)
    .parent()
    .parent()
    .remove();
}

function queryWaresInfo() {
    let url="/configuration/queryWaresInfo";
  ajax_data(url,{}, function(res) {
    let option = "<option value='' data-id=''>选择商品名称</option>";
    if (res.length) {
      res.forEach(function(item, index) {
        option += `<option value="${item.waresName}" data-id="${item.waresId}">${item.waresName}</option>`;
      });
    }
    $(".commodity select").html(option);
    allwares = res;
  });
}
