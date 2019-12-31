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
            method: "get",
            url: baseUrl + "/cost/queryCost", //请求路径
            striped: true, //是否显示行间隔色
            pageNumber: 1, //初始化加载第一页
            pagination: true, //是否分页
            sidePagination: "client", //server:服务器端分页|client：前端分页
            pageSize: 5, //单页记录数
            pageList: [10, 20, 30], //可选择单页记录数
            showRefresh: false, //刷新按钮
            cache: true, // 禁止数据缓存
            search: false, // 是否展示搜索
            showLoading: true,
            queryParams: queryParams,
            columns: [{
                    title: "开支id",
                    field: "costId"
                },
                {
                    title: "开支时间",
                    field: "costTime"
                },
                {
                    title: "开支的店铺",
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
                    title: "发票截图",
                    field: "receiptPic"
                },
                {
                    title: "备注信息",
                    field: "remark"
                },
                // {
                //   title: "操作",
                //   field: "publicationTime",
                //   events: operateEvents,
                //   formatter: operation //对资源进行操作,
                // }
            ]
        });
        $('#statisticalSpending').bootstrapTable({ height: $(window).height() - 120 });
        //当表格内容的高度小于外面容器的高度，容器的高度设置为内容的高度，相反时容器设置为窗口的高度-160
        if ($(".fixed-table-body table").height() < $(".fixed-table-container").height()) {
            $(".fixed-table-container").css({ "padding-bottom": "0px", height: $(".fixed-table-body table").height() + 20 });
            // 是当内容少时，使用搜索功能高度保持不变
            $('#statisticalSpending').bootstrapTable('resetView', { height: "auto" });
        } else {
            $(".fixed-table-container").css({ height: $(window).height() - 160 });
        }
        queryCostType();
    }

    function operation(vlaue, row) {
        var html = `
        <button type="button" id="edit" class="btn btn-info btn-sm editBtn">修改</button>
        `;
        return html;
    }
    var operateEvents = {
        "click #edit": function(e, v, row) {
            isadd = false;
            open_html("修改信息", "#editData");
        }
    };
    //查询条件
    function queryParams() {
        return {
            startTime: $(".areaSearch .startTime").val() ?
                $(".areaSearch .startTime").val() : undefined, // 开支时间
            endTime: $(".areaSearch .endTime").val() ?
                $(".areaSearch .startTime").val() : undefined, // 开支时间
            costTypeId: $(".areaSearch .query_costTypeId").val() ?
                $(".areaSearch .query_costTypeId").val() : undefined, // 开支分类id
            ownerId: $(".areaSearch .query_ownerId").val() ?
                $(".areaSearch .query_ownerId").val() : undefined // 部门id
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
    // 添加或修改
    $(".condition .confirmBtn").on("click", function() {

    });
    // 开支分类
    function queryCostType() {
        let params = {
            //     categoryName: ""
        };
        ajax_data(
            "/cost/queryCostCategory", { params: JSON.stringify(params) },
            function(res) {
                let option = "<option value=''>开支分类</option>";
                res.forEach(function(element) {
                    option += `<option value="${element}">${element}</option>`;
                });
                $(".query_costTypeId").html(option);
                $(".query_costTypeId").chosen({});
                $(".costTypeId").html(option);
                $(".costTypeId").chosen({});
            }
        );
    }
})(document, window, jQuery);