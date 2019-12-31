$(function() {
  var barChart = echarts.init(document.getElementById("echarts-bar-chart"));
  var baroption = {
    title: {
      text: "销售额利润趋势图"
    },
    tooltip: {
      trigger: "axis"
    },
    legend: {
      data: ["销售额", "利润"]
    },

    calculable: true,
    xAxis: [
      {
        type: "category",
        data: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月"
        ]
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
        type: "line",
        data: [100, 143, 244, 245, 66, 666, 122, 444, 556, 123, 123, 234]
      },
      {
        name: "利润",
        type: "line",
        data: [30, 43, 14, 235, 66, 66, 52, 44, 56, 23, 33, 52, 78]
      }
    ]
  };
  barChart.setOption(baroption);
  $(window).resize(barChart.resize);
  var apiMap = {
    company: {
      sales: "/inventory/companySales",
      profit: "/inventory/companyProfit"
    },
    store: {
      sales: "/inventory/storeSales",
      profit: "/inventory/storeProfit"
    },
    directStore: {
      sales: "",
      profit: ""
    }
  };
  var urlSales = apiMap.company.sales;
  var urlProfit = apiMap.company.profit;

  function init() {
    let params = {
      startTime: $(".startTime").val(),
      editTime: $(".endTime").val()
    };
    let sales = [],
      profit = [],
      batchno = [];
    // 销售额
    ajax_data(
      urlSales,
      { params: JSON.stringify(params), async: false },
      function(res) {
        batchno = [];
        sales = [];
        res.forEach(function(v, i) {
          sales.push(v.sales);
          batchno.push(v.batchno);
        });
      }
    );
    // 利润
    ajax_data(
      urlProfit,
      { params: JSON.stringify(params), async: false },
      function(res) {
        profit = [];
        res.forEach(function(v, i) {
          profit.push(v.profit);
        });
        baroption = {
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
          xAxis: [
            {
              type: "category",
              data: batchno
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
              type: "line",
              data: sales
            },
            {
              name: "利润",
              type: "line",
              data: profit
            }
          ]
        };
        barChart.setOption(baroption);
      }
    );
  }

  init();
  $(".queryBtn").click(function() {
    init();
  });
  $(".salseType input[type='radio']").change(function() {
    // 公司：0  直营店：1 加盟店：2
    if ($(this).val() == "0") {
      urlSales = apiMap.company.sales;
      urlProfit = apiMap.company.profit;
    } else if ($(this).val() == "1") {
      urlSales = apiMap.directStore.sales;
      urlProfit = apiMap.directStore.profit;
    } else {
      urlSales = apiMap.store.sales;
      urlProfit = apiMap.store.profit;
    }
    init()
  });

  $(window).resize(barChart.resize);
});
