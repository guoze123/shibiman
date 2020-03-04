"use strict";

$(function () {
  var barChart = echarts.init(document.getElementById("echarts-bar-chart"));
  $(".startTime,.endTime").datepicker({
    startView: 1,
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    minViewMode: 1,
    format: "yyyy-mm"
  });
  var apiMap = {
    company: {
      // 公司
      sales: "/inventory/queryCompanyPolyline"
    },
    directStore: {
      // 直营店
      sales: "/inventory/queryDerectStorePolyline"
    },
    store: {
      sales: "/inventory/queryFranchiseStorePolyline"
    }
  };
  var urlSales = apiMap.company.sales;

  function init() {
    var params = {
      startTime: $(".startTime").val().trim(),
      endTime: $(".endTime").val().trim()
    };
    var sales = [],
        profit = [],
        batchno = [];
    ajax_data(urlSales, {
      params: JSON.stringify(params)
    }, function (res) {
      var baroption = {
        title: {
          text: "趋势图"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["销售额", "利润"]
        },
        calculable: true,
        xAxis: [{
          type: "category",
          data: batchno
        }],
        yAxis: [{
          type: "value"
        }],
        series: [{
          name: "销售额",
          type: "line",
          data: sales
        }, {
          name: "利润",
          type: "line",
          data: profit
        }]
      };
      profit = [];
      batchno = [];
      sales = [];
      res.profit.forEach(function (v, i) {
        profit.push(v.profit);
        batchno.push(v.batchno);
      });
      res.sales.forEach(function (v, i) {
        sales.push(v.sales);
      });
      baroption["series"][0]["data"] = sales;
      baroption["series"][1]["data"] = profit;
      baroption["xAxis"][0]["data"] = batchno;
      barChart.clear();
      barChart.setOption(baroption);
    });
  }

  init();
  $(".queryBtn").click(function () {
    init();
  });
  $(".salseType input[type='radio']").change(function () {
    // 公司：0  直营店：1 加盟店：2
    if ($(this).val().trim() == "0") {
      urlSales = apiMap.company.sales;
    } else if ($(this).val().trim() == "1") {
      urlSales = apiMap.directStore.sales;
    } else {
      urlSales = apiMap.store.sales;
    }

    init();
  });
  $(window).resize(barChart.resize);
});