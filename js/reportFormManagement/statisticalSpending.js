(function(document, window, $) {
    "use strict";
    var isadd = false;
    $(".startTime ,.endTime").datepicker({
        startView: 1,
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        minViewMode: 1,
        format: "yyyy-mm"
    });

    function initFn() {
        $("#statisticalSpending").bootstrapTable({
            method: "post",
            url: base + "/cost/queryCostAnalysis", //请求路径
            //url: "../../testJson/storeManagement.json", //请求路径
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
            contentType: "application/x-www-form-urlencoded",
            queryParams: queryParams,
            columns: [{
                    title: "开支时间",
                    field: "batchno"
                },
                {
                    title: "开支的店铺",
                    field: "ownerName"
                },

                {
                    title: "开支金额",
                    field: "amount"
                },
                {
                    title: "操作",
                    field: "publicationTime",
                    events: operateEvents,
                    formatter: operation //对资源进行操作,
                }
            ]
        });
        queryCostType();
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
        "click #detail": function(e, v, row) {
            ajax_data(
                "/cost/queryCostAnalysisDetail", {
                    params: {
                        jsonStr: JSON.stringify({
                            ownerId: row.ownerId,
                            startTime: $(".areaSearch .startTime").val(),
                            endTime: $(".areaSearch .endTime").val()
                        })
                    },
                    contentType: "application/x-www-form-urlencoded;charset=utf-8"
                },
                function(res) {
                    $("#costDetailTable").bootstrapTable("destroy")
                    $("#costDetailTable").bootstrapTable({
                        striped: true, //是否显示行间隔色
                        pagination: false, //是否分页,
                        data: res,
                        height: $("body").height() < 500 ? $("body").height() - 120 : 330,
                        columns: [{
                                title: "开支时间",
                                field: "batchno"
                            },
                            {
                                title: "开支的店铺",
                                field: "ownerName"
                            },
                            {
                                title: "开支名称",
                                field: "categoryName"
                            },
                            {
                                title: "开支金额",
                                field: "amount"
                            }
                        ]
                    });
                    open_html("详情信息", "#costDetail", function() {});
                }
            );
        }
    };
    //查询条件
    function queryParams() {
        return {
            jsonStr: JSON.stringify({
                startTime: $(".areaSearch .startTime").val() ?
                    $(".areaSearch .startTime").val() :
                    undefined, // 开支时间
                endTime: $(".areaSearch .endTime").val() ?
                    $(".areaSearch .startTime").val() :
                    undefined, // 开支时间
                costTypeId: $(".areaSearch .query_costTypeId").val() ?
                    $(".areaSearch .query_costTypeId").val() :
                    undefined, // 开支分类id
                ownerId: $(".areaSearch .query_ownerName").val() ?
                    $(".areaSearch .query_ownerName").val() :
                    undefined // 部门名称
            })
        };
    }
    initFn();
    // 点击查询按钮
    $("#eventqueryBtn").click(function() {
        $("#statisticalSpending").bootstrapTable("refresh");
    });

    $(".uploadimg").change(function() {
        uploadFile($(this));
    });
    $(".condition .closeBtn").on("click", function(params) {
        layer.close(layer.index);
    });

    // 开支分类
    function queryCostType() {
        let params = {};
        ajax_data(
            "/cost/queryCostCategory", { params: JSON.stringify(params) },
            function(res) {
                let option = "<option value=''>开支分类</option>";
                res.forEach(function(element) {
                    option += `<option value="${element}">${element}</option>`;
                });
                $(".query_costTypeId").html(option);
                $(".query_costTypeId").chosen({});
            }
        );
    }
})(document, window, jQuery);