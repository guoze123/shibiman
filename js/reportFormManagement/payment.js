(function(document, window, $) {
    "use strict";

    function initFn() {
        $("#payment").bootstrapTable({
            method: "get",
            //  url: baseUrl + "/inventory/queryPayment", //请求路径
            url: baseUrl + "../../testJson/storeManagement.json", //请求路径
            striped: true, //是否显示行间隔色
            pageNumber: 1, //初始化加载第一页
            pagination: true, //是否分页
            sidePagination: "client", //server:服务器端分页|client：前端分页
            pageSize: 10, //单页记录数
            height: $(window).height() - 150,
            showRefresh: false, //刷新按钮
            cache: true, // 禁止数据缓存
            search: false, // 是否展示搜索
            showLoading: true,
            queryParams: queryParams,
            columns: [{
                    title: "店铺id",
                    field: "stockId"
                },
                {
                    title: "店铺名称",
                    field: "stockName"
                },
                {
                    title: "应付金额",
                    field: "totalAmount"
                },
                {
                    title: "实支付金额",
                    field: "payedAmount"
                },
                {
                    title: "差额",
                    field: "balance"
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

        var html = `
        <button type="button" id="paymentBtn" class="btn btn-info btn-sm paymentBtn">继续支付</button>
        <button type="button" id="detailBtn" class="btn btn-info btn-sm detailBtn">支付详情</button>
        `;
        return html;
    }
    var operateEvents = {
        "click #detailBtn": function(e, v, row) {
            let params = {
                storckId: row.storckId,
                storeId: row.storeId
            };
            ajax_data(
                "/inventory/queryPaymentDetail", { params: JSON.stringify(params) },
                function(res) {
                    $(".storeId").val(res[0]["storeId"]);
                    $(".storeName").val(res[0]["storeName"]);
                    $(".totalAmount").val(res[0]["totalAmount"]);
                    open_html("支付详情", "#payDetail", function() {
                        $("input[type='text']").val("")
                    });
                }
            );
            open_html("支付详情", "#payDetail", function() {
                $("input[type='text']").val("")
            });
        },
        "click #paymentBtn": function(e, v, row) {
            $("#keepPaying .storckId").val(row.storckId);
            $("#keepPaying .storeName").val(row.storckName);
            $("#keepPaying .totalAmount").val(row.totalAmount);
            $("#keepPaying .storeId").val(row.storeId);
            open_html("继续支付", "#keepPaying", function() {
                $("input[type='text']").val("")
            })
        }
    };

    function queryParams() {
        return {
            startTime: $(".query_startTime").val(),
            stopTime: $(".query_stopTime").val()
        };
    }
    initFn();
    // 点击查询按钮
    $("#eventqueryBtn").click(function() {
        $("#payment").bootstrapTable("refresh");
    });

    $(".condition .closeBtn").on("click", function(params) {
        layer.close(layer.index);
    });
    // 添加或修改
    $("#keepPaying .condition .confirmBtn").on("click", function() {
        let params = {
            storckId: $("#keepPaying .storckId").val(),
            storeId: $("#keepPaying .storeId").val(),
            paymentTime: $("#keepPaying .payTime").val(),
            totalAmount: $("#keepPaying .totalAmount").val(),
            paymentAmount: $("#keepPaying .amount").val(),
            paymentWay: $("#keepPaying .payType inpu[type='radio']:checked").val()
        }
        ajax_data("", { params: JSON.stringify(params) }, function(res) {
            if(res.resultCode >-1){
                $("#payment").bootstrapTable("refresh");
                layer.close(layer.index);
            }else{
                tips("支付失败",5)
            }
        });
    });
})(document, window, jQuery);