(function (document, window, $) {
  "use strict";
  var departmentSpending = echarts.init(document.getElementById("departmentSpending"));
  var storeSpending = echarts.init(document.getElementById("storeSpending"));
  var isadd = false;
  monthRange(".startTime", ".endTime")
  function initFn() {
    ajax_data(
      "/cost/queryCostAnalysis",
      { params: queryParams(),contentType: "application/x-www-form-urlencoded"},
      function(res) {
        queryDepartment();
        queryStore();
        $("#statisticalSpending").bootstrapTable({
         // method: "post",
         // url: base + "/cost/queryCostAnalysis", //请求路径
          data: res.tblData,
          striped: true, //是否显示行间隔色
          pageNumber: 1, //初始化加载第一页
          pagination: true, //是否分页
          sidePagination: "client", //server:服务器端分页|client：前端分页
          pageSize: 10, //单页记录数
          pageList: [10, 20, 30], //可选择单页记录数
          height: $(window).height() - 110,
          showRefresh: false, //刷新按钮
          cache: true, // 禁止数据缓存
          search: false, // 是否展示搜索
          sortable: true,
          sortOrder: "asc", //排序方式
          showLoading: true,
          contentType: "application/x-www-form-urlencoded",
          queryParams: queryParams,
          columns: [
            {
              title: "开支时间",
              field: "batchno",
              sortable: true
            },
            {
              title: "核算单元",
              field: "ownerName",
              sortable: true
            },
    
            {
              title: "开支金额",
              field: "amount",
              sortable: true
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
    );
    //queryCostType();
  }
  function operation(vlaue, row) {
    let purviewList = getQueryString("purview").split(",");
    let html = "";
    if (purviewList.includes("4")) {
      html += `<button type="button" id="detail" class="btn  btn-primary detailBtn btn-sm">详情</button>`;
    }
    return html;
  }
  var operateEvents = {
    "click #detail": function (e, v, row) {
      ajax_data(
        "/cost/queryCostAnalysisDetail",
        {
          params: {
            jsonStr: JSON.stringify({
              ownerId: row.ownerId,
              batchno: row.batchno,
              ownerName: row.ownerName
            })
          },
          contentType: "application/x-www-form-urlencoded;charset=utf-8"
        },
        function (res) {
          $("#costDetailTable").bootstrapTable("destroy");
          $("#costDetailTable").bootstrapTable({
            striped: true, //是否显示行间隔色
            pagination: false, //是否分页,
            data: res,
            height: $("body").height() < 500 ? $("body").height() - 120 : 330,
            sortable: true,
            sortOrder: "asc", //排序方式
            columns: [
              {
                title: "开支时间",
                field: "batchno",
                sortable: true
              },
              {
                title: "开支的店铺",
                field: "ownerName",
                sortable: true
              },
              {
                title: "开支名称",
                field: "categoryName",
                sortable: true
              },
              {
                title: "开支金额",
                field: "amount",
                sortable: true
              },
              {
                title: "备注",
                field: "remark",
              }

            ]
          });
          open_html("详情信息", "#costDetail", function () { });
        }
      );
    }
  };
  //查询条件
  function queryParams() {
    return {
      jsonStr: JSON.stringify({
        startTime: $(".searchList .startTime")
          .val()
          .trim()
          ? $(".searchList  .startTime")
            .val()
            .trim()
          : undefined, // 开支时间
        endTime: $(".searchList  .endTime")
          .val()
          .trim()
          ? $(".searchList  .endTime")
            .val()
            .trim()
          : undefined, // 开支时间
        costTypeId: $(".searchList  .query_costTypeId")
          .val()
          .trim()
          ? $(".searchList  .query_costTypeId")
            .val()
            .trim()
          : undefined, // 开支分类id
        ownerName: $(".searchList  .query_ownerName")
          .val()
          .trim()
          ? $(".searchList .query_ownerName")
            .val()
            .trim()
          : undefined // 部门名称
      })
    };
  }
  initFn();

  // 查询部门的开支
  function queryDepartment(param) {
    let departmentdata = [{ name: "人事", value: "20" },
    { name: "招商", value: "20" }, { name: "运营", value: "20" }, { name: "客服", value: "20" }, { name: "综合", value: "20" }]
    let departmentName = [];
    departmentdata.forEach(function (item) {
      departmentName.push(item.name)
    })
    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}:{c} ({d}%)'
      },
      legend: {
        x: "left",
        orient: "vertical",
        data: departmentName
      },
      labelLine: {
        normal: {
          show: false // show设置线是否显示，默认为true，可选值：true ¦ false
        }
      },
      series: [
        {
          type: "pie",
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          data: departmentdata
        }
      ]
    };
    departmentSpending.clear();
    departmentSpending.setOption(option);
  }
  // 查询店铺的开支
  function queryStore(param) {
    let data = [
      { name: "test1", value: "20" },
      { name: "test2", value: "20" },
      { name: "test3", value: "20" },
      { name: "test4", value: "20" },
      { name: "test5", value: "20" }]
    let storeName = [], storeData = [];
    data.forEach(function (item) {
      storeName.push(item.name);
      storeData.push(item.value)
    })

    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
    
      grid: {
        x: 30,
        x2: 10
      },
      xAxis: [
        {
          type: "category",
          data: storeName
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ],
      series: [{
          type: "bar",
          data: storeData,
          itemStyle: {
            normal: {
              color: "#1a7bb9"
            }
          }
        }
      ]
    };
    storeSpending.clear();
    storeSpending.setOption(option);
  }

  // 点击查询按钮
  $("#eventqueryBtn").click(function () {
    $("#statisticalSpending").bootstrapTable("destroy");
    initFn()
  });

  $(".uploadimg").change(function () {
    uploadFile($(this));
  });
  $(".condition .closeBtn").on("click", function (params) {
    layer.closeAll("page");
  });

  // 开支分类
  function queryCostType() {
    let params = {};
    ajax_data(
      "/cost/queryCostCategory",
      { params: JSON.stringify(params) },
      function (res) {
        let option = "<option value=''>开支分类</option>";
        res.forEach(function (element) {
          option += `<option value="${element.categoryId}">${element.categoryName}</option>`;
        });
        $(".query_costTypeId").html(option);
        $(".query_costTypeId").chosen({});
      }
    );
  }

  // 导出 当前总开支
  $(".exportTotal").click(function () {
    let menuName = $('.J_menuTab.active', parent.document).text().trim();
    let titleName = "总开支";
    let form = $('<form id="to_export_total" style="display:none"></form>').attr({
      action: base + "/common/exportCostRecord",
      method: "post"
    });
    $("<input>")
      .attr("name", "jsonStr")
      .val(JSON.stringify({
        startTime: $(".startTime").val() ? $(".startTime").val() : undefined,
        endTime: $(".endTime").val() ? $(".endTime").val() : undefined,
        ownerName: $(".query_ownerName").val() ? $(".query_ownerName").val() : undefined,
        fileName: menuName + "-" + titleName + ".csv"
      }))
      .appendTo(form);
    $("body").append(form);
    $("#to_export_total")
      .submit()
      .remove();
  });

  // 导出所有的详单
  $(".exportDetails").click(function () {
    let menuName = $('.J_menuTab.active', parent.document).text().trim();
    let titleName = "详单";
    let form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "/common/exportCostDetail",
      method: "post"
    });
    $("<input>")
      .attr("name", "jsonStr")
      .val(JSON.stringify({
        startTime: $(".startTime").val() ? $(".startTime").val() : undefined,
        endTime: $(".endTime").val() ? $(".endTime").val() : undefined,
        ownerName: $(".query_ownerName").val() ? $(".query_ownerName").val() : undefined,
        fileName: menuName + "-" + titleName + ".csv"
      }))
      .appendTo(form);
    $("body").append(form);
    $("#to_export")
      .submit()
      .remove();
  });

})(document, window, jQuery);
