(function(document, window, $) {
  "use strict";

  monthRange(".startTime",".endTime")
  var storeTop5 = echarts.init(document.getElementById("storeTop5"));
  var storeLast5 = echarts.init(document.getElementById("storeLast5"));
  function initFn() {
    let data=[
      {storeName:"test1",avgSales:"100",avgProfit:"50"},
      {storeName:"test2",avgSales:"100",avgProfit:"50"},
      {storeName:"test3",avgSales:"100",avgProfit:"50"},
      {storeName:"test4",avgSales:"100",avgProfit:"50"},
      {storeName:"test5",avgSales:"100",avgProfit:"50"},
    ]
    query_storeTop5(data);
    query_storeLast5(data);
    $("#storeSales").bootstrapTable({
      method: "post",
      url: base + "/inventory/queryStoreAnalysisTable", //请求路径
      striped: true, //是否显示行间隔色
      pageNumber: 1, //初始化加载第一页
      pagination: true, //是否分页
      sidePagination: "client", //server:服务器端分页|client：前端分页
      pageSize: 10, //单页记录数
      pageList: [10, 20, 30], //可选择单页记录数
      height: $(window).height() - 150,
      showRefresh: false, //刷新按钮
      cache: true, // 禁止数据缓存
      search: false, // 是否展示搜索
      showLoading: true,
      sortable: true,
      sortOrder: "asc",//排序方式
      queryParams: queryParams,
      contentType: "application/x-www-form-urlencoded",
      columns: [
        {
          title: "时间",
          field: "batchno"
        },
        {
          title: "店铺名称",
          field: "storeName",
          sortable: true
        },
        {
          title: "月度销售额",
          field: "avgSales",
          sortable: true,
        },
        {
          title: "月度利润",
          field: "avgProfit",
          sortable: true,
        },
        {
          title: "等级",
          field: "avgStoreLevel",
          sortable: true,
        },
        {
          title: "目标值",
          field: "targetValue",
          sortable: true,
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
  // <button type="button" id="edit" class="btn btn-info btn-sm">修改</button>
  function operation(vlaue, row) {
    let purviewList = getQueryString("purview").split(",");
    let html = "";
    if (purviewList.includes("4")) {
      html += `<button type="button" id="detail" class="btn  btn-primary detailBtn btn-sm">详情</button>`;
    }
    return html;
  }

  var operateEvents = {
    "click #detail": function(e, v, row) {
      ajax_data(
        "/inventory/queryStoreAnalysisDetail",
        {
          params: {
            jsonStr: JSON.stringify({
              storeId: row.storeId,
              storeName:row.storeName,
              startTime:row.batchno,
              endTime:row.batchno
            })
          },
          contentType: "application/x-www-form-urlencoded;charset=utf-8"
        },
        function(res) {
          $("#storeDetailTable").bootstrapTable("destroy");
          $("#storeDetailTable").bootstrapTable({
            striped: true, //是否显示行间隔色
            pagination: false, //是否分页,
            data: res,
            height: $("body").height() < 500 ? $("body").height() - 120 : 300,
            columns: [
              {
                title: "时间",
                field: "operationDate"
              },
              {
                title: "店铺名称",
                field: "storeName"
              },
              {
                title: "销售员",
                field: "sellers"
              },
              {
                title: "总金额",
                field: "totalAmount"
              },
              {
                title: "实付金额",
                field: "payedAmount"
              },{
                title: "客户类型",
                field: "custType"
              }
            ]
          });
          open_html("详情信息", "#storeDetail", function() {});
        }
      );
    }
  };

  function queryParams(params) {
    return {
      jsonStr: JSON.stringify({
        startTime: $(".startTime")
          .val()
          .trim()
          ? $(".startTime")
              .val()
              .trim()
          : undefined,
        endTime: $(".endTime")
          .val()
          .trim()
          ? $(".endTime")
              .val()
              .trim()
          : undefined,
        storeName: $(".query_storeName")
          .val()
          .trim()
          ? $(".query_storeName")
              .val()
              .trim()
          : undefined
      })
    };
  }
  initFn();
  function query_storeTop5(data) {
    let storeName=[],sales=[],profit=[];
    data.forEach(function (ele) {
      storeName.push(ele.storeName)
      sales.push(ele.avgSales)
      profit.push(ele.avgProfit)
    })
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ["销售额", "利润"]
      },
      grid: {
       x:30,
       x2:10
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
      series: [
        {
          name: "销售额",
          type: "bar",
          data: sales,
          itemStyle:{
            normal:{
              color:"#1a7bb9"
            }
          }
        },
        {
          name: "利润",
          type: "bar",
          data: profit,
          itemStyle:{
            normal:{
              color:"#ed5565"
            }
          }
        }
      ]
    };
    storeTop5.clear();
    storeTop5.setOption(option);
  }
  function query_storeLast5(data) {
    let storeName=[],sales=[],profit=[];
    data.forEach(function (ele) {
      storeName.push(ele.storeName)
      sales.push(ele.avgSales)
      profit.push(ele.avgProfit)
    })
    let option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ["销售额", "利润"]
      },
      grid: {
       x:30,
       x2:10
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
      series: [
        {
          name: "销售额",
          type: "bar",
          data: sales,
          itemStyle:{
            normal:{
              color:"#1a7bb9"
            }
          }
        },
        {
          name: "利润",
          type: "bar",
          data: profit,
          itemStyle:{
            normal:{
              color:"#ed5565"
            }
          }
        }
      ]
    };
    storeLast5.clear();
    storeLast5.setOption(option);
  }

  $(window).resize(function() {
    storeTop5.resize();
    storeLast5.resize();
  });
  // 点击查询按钮
  $("#eventqueryBtn").click(function() {
    $("#storeSales").bootstrapTable("selectPage",1);
    $("#storeSales").bootstrapTable("refresh");
  });
  $("#queryStore").click(function() {
    $("#storeProfit").bootstrapTable("refresh");
  });
  // 导出
  $(".exportBtn").click(function() {
    let menuName= $('.J_menuTab.active', parent.document).text().trim();
    let titleName=$(this).parents(".ibox").find(".ibox-title h5 ").text().trim();
    let form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "/common/exportStoreAnalysis",
      method: "post"
    });
    $("<input>")
      .attr("name", "jsonStr")
      .val(JSON.stringify({
        startTime: $(".startTime").val()?$(".startTime").val():undefined,
        endTime:$(".endTime").val()?$(".endTime").val():undefined,
        storeName:$(".query_storeName").val().trim()?$(".query_storeName").val().trim():undefined,
        fileName: menuName + "-" + titleName+".csv"
      }))
      .appendTo(form);
    $("body").append(form);
    $("#to_export")
      .submit()
      .remove();
  });
})(document, window, jQuery);
