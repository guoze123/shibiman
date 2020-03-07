"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var sales_bar = echarts.init(document.getElementById("sales_bar"));
var serving_bar = echarts.init(document.getElementById("serving_bar"));
(function (document, window, $) {
  "use strict";

  monthRange(".startTime", ".endTime");
 
  var data={
    test:13,
    test1:12,
    test2:19
  }
 
  query_sales_bar();
  query_serving_bar({});

  function initFn() {
    $("#personal").bootstrapTable({
      method: "post",
      url: base + "",
      //请求路径
      striped: true,
      //是否显示行间隔色
      pageNumber: 1,
      //初始化加载第一页
      pagination: true,
      //是否分页
      sidePagination: "client",
      //server:服务器端分页|client：前端分页
      pageSize: 10,
      //单页记录数
      pageList: [10, 20, 30],
      //可选择单页记录数
      height: $(window).height() - 150,
      showRefresh: false,
      //刷新按钮
      cache: true,
      // 禁止数据缓存
      search: false,
      // 是否展示搜索
      showLoading: true,
      sortable: true,
      sortOrder: "asc",
      //排序方式
      queryParams: queryParams,
      contentType: "application/x-www-form-urlencoded",
      // responseHandler: function(res) {
      //     return res.storeAvgData;
      // },
      columns: [{
        title: "员工姓名",
        field: "",
        sortable: true
      }, {
        title: "开始时间",
        field: "startTime",
        sortable: true
      }, {
        title: "结束时间",
        field: "endTime",
        sortable: true
      }, {
        title: "销售额",
        field: "",
        sortable: true
      }, {
        title: "服务次数",
        field: "",
        sortable: true
      } //   {
      //     title: "操作",
      //     field: "publicationTime",
      //     events: operateEvents,
      //     formatter: operation //对资源进行操作,
      //   }
      ]
    });
  } // <button type="button" id="edit" class="btn btn-info btn-sm">修改</button>


  function operation(vlaue, row) {
    var purviewList = getQueryString("purview").split(",");
    var html = "";

    if (purviewList.includes("4")) {
      html += "<button type=\"button\" id=\"detail\" class=\"btn  btn-primary detailBtn btn-sm\">\u8BE6\u60C5</button>";
    }

    return html;
  }

  var operateEvents = {
    "click #detail": function clickDetail(e, v, row) {
      ajax_data("/inventory/queryStoreAnalysisDetail", {
        params: {
          jsonStr: JSON.stringify({
            storeId: row.storeId,
            storeName: row.storeName,
            startTime: row.batchno,
            endTime: row.batchno
          })
        },
        contentType: "application/x-www-form-urlencoded;charset=utf-8"
      }, function (res) {
        $("#storeDetailTable").bootstrapTable("destroy");
        $("#storeDetailTable").bootstrapTable({
          striped: true,
          //是否显示行间隔色
          pagination: false,
          //是否分页,
          data: res,
          height: $("body").height() < 500 ? $("body").height() - 120 : 300,
          columns: [{
            title: "时间",
            field: "operationDate"
          }, {
            title: "店铺名称",
            field: "storeName"
          }, {
            title: "销售员",
            field: "sellers"
          }, {
            title: "总金额",
            field: "totalAmount"
          }, {
            title: "实付金额",
            field: "payedAmount"
          }, {
            title: "客户类型",
            field: "custType"
          }]
        });
        open_html("详情信息", "#storeDetail", function () {});
      });
    }
  };

  function queryParams() {
    return {
      jsonStr: JSON.stringify(_objectSpread({}, userInformation(), {
        startTime: $(".startTime").val().trim() ? $(".startTime").val().trim() : undefined,
        endTime: $(".endTime").val().trim() ? $(".endTime").val().trim() : undefined
      }))
    };
  }

  function userInformation() {
    var userValue = $(".query_userinformation").val().trim();

    if (userValue) {
      var type = "";

      if (/^[0-9]{5}$/.test(userValue)) {
        type = "id";
      } else if (/^[0-9]{11}$/.test(userValue)) {
        type = "phoneNumber";
      } else {
        type = "name";
      }

      return {
        userType: type,
        userValue: userValue
      };
    } else {
      return {
        userType: undefined,
        userValue: undefined
      };
    }
  }

  function query_sales_bar() {
    ajax_data("", {
      params: queryParams(),
      contentType: "application/x-www-form-urlencoded"
    }, function (res) {});
    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'

        }
      },
      grid: {
        x: 45,
        y: 20,
        y2: 20,
        x2: 10
      },
      xAxis: [{
        type: 'category',
        data: ['1', '2', '3', '4', '5', '6', '7']
      }],
      yAxis: [{
        type: 'value'
      }],
      series: [{
        name: '服务次数',
        type: 'bar',
        data: [10, 52, 200, 334, 390, 330, 220],
        itemStyle:{
          normal:{
            color:"#1a7bb9"
          }
        }
      }]
    };
    sales_bar.clear();
    sales_bar.setOption(option);
  }

  function query_serving_bar(data) {
    let option = {
      noDataLoadingOption: {
        text: '无数据',
        effect: 'bubble',
        effectOption: {
          effect: {
            n: 0
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        x: 45,
        y: 20,
        y2: 20,
        x2: 10
      },
      xAxis: [
        {
          type: 'category',
          data: []
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '服务次数',
          type: 'bar',
          data: []
        }
      ]
    };
    let nameList = [];
    let valueList = [];
    for (let k in data) {
      nameList.push(k);
      valueList.push(data[k])
    }
    option.xAxis[0].data=nameList;
    option.series[0].data=valueList
   // serving_bar.clear();
    serving_bar.setOption(option,true);
  }

  $(window).resize(function () {
    sales_bar.resize();
    serving_bar.resize();
  });
  initFn(); // 点击查询按钮

  $("#eventqueryBtn").click(function () {
    $("#personal").bootstrapTable("selectPage", 1);
    $("#personal").bootstrapTable("refresh");
    query_sales_bar();
    
    query_serving_bar({
      test:123,
      test1:788,
      test2:34
    });
  }); // 导出

  $(".exportBtn").click(function () {
    var form = $('<form id="to_export" style="display:none"></form>').attr({
      action: base + "",
      method: "post"
    });
    $("<input>").attr("name", "jsonStr").val(JSON.stringify(queryParams()));
    $("body").append(form);
    $("#to_export").submit().remove();
  });
})(document, window, jQuery);