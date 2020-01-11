(function(document, window, $) {
    "use strict";
    var isadd = false;

    function initFn() {
        queryStore();
        $("#importInventory").bootstrapTable({
            method: "post",
            url: base + "/inventory/queryEntryStock", //请求路径
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
            columns: [{
                    title: " 日期",
                    field: "operationDate"
                },

                {
                    title: "发货方",
                    field: "fromStoreId"
                },
                {
                    title: "收货方",
                    field: "toStoreId"
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
        });
    }

    function operation(vlaue, row) {
        let purviewList = getQueryString("purview").split(",");
        let html = "";
        if (purviewList.includes("3")) {
            html += `<button type="button" id="edit" class="btn btn-info btn-sm editBtn">修改</button>`;
        }
        if (purviewList.includes("4")) {
            html += `<button type="button" id="detail" class="btn btn-primary btn-sm detailBtn">详情</button>`;
        }
        return html;
    }

    var operateEvents = {
        "click #edit": function(e, v, row) {

            ajax_data(
                "/inventory/queryEntryStockDetail", {
                    params: { stockId: row.stockId },
                    contentType: "application/x-www-form-urlencoded;charset=utf-8"
                },
                function(res) {
                    let params = {
                        startTime: row.operationDate, // 日期
                        ordernum: row.ordernum, //订单
                        totalAmount: row.amount, // 应付
                        payedAmount: row.payedAmount, // 实付
                        fromStoreId: row.fromStoreId, // 发货方
                        toStoreId: row.toStoreId, // 收货放
                        remark: row.remark, // 备注
                        waresList: res, // 商品
                        entryType: 2,
                        transferType: row.transferType
                    };
                    ajax_data(
                        "/inventory/modifyEntryStock", {
                            params: {
                                jsonStr: JSON.stringify(params)
                            },
                            contentType: "application/x-www-form-urlencoded;charset=utf-8"
                        },
                        function(res) {}
                    );
                    $(".startTime").val(row.operationDate); // 日期
                    $(".handleAmount").val(row.totalAmount); // 应付
                    $(".actualAmount").val(row.payedAmount); // 实付
                    $(".consignee").val(row.toStoreId); // 收货放
                    $(".shipper").val(row.fromStoreId); // 发货方
                    $(".remark").val(row.remark); // 备注
                    $(".picList").attr("src", row.row);
                    isadd = false;
                    if (res.length == 1) {
                        $(".firstGroup")
                            .find(".name")
                            .val(allWares(res[0].waresId));
                        $(".firstGroup")
                            .find(".number")
                            .val(res[0].waresCount);
                    }
                    if (res.length > 1) {
                        function allWares(selectId) {
                            let option = "";
                            if (allwares.length) {
                                allwares.forEach(function(item, index) {
                                    option += `<option value="${item.waresName}" data-id="${item.waresId}" ${ item.waresId == selectId ? "selected":""} >${item.waresName}</option>`;
                                });
                            }
                            return option
                        }
                        $(".firstGroup")
                            .find(".name")
                            .html(allWares(res[0].waresId));
                        $(".firstGroup")
                            .find(".number")
                            .val(res[0].waresCount);
                        let str = "";
                        for (let i = 1; i < res.length; i++) {
                            str += `<div class="list_row commodity newShop">
                                    <div style="width: 100%;">
                                    <span>商品名称</span>
                                    <select class="form-control name">
                                    ${allWares(res[i].waresId)}
                                    </select>
                                    <span style="margin-left: 10px;">商品数量</span>
                                    <input type="text" placeholder="商品数量" class="form-control number" value="${res[i].waresCount}">
                                    <button style=" margin-left: 10px;" onclick="deleteCommodity(this)">删除商品</button>
                                    </div></div>
                                            `;
                        }
                        $(".firstGroup").after(str);
                    }
                    open_html("修改信息", "#editData", function(params) {
                        $("#editData input").val("");
                        $("#editData select").val("");
                        $("#editData .newShop").remove();
                        $("#editData img").attr("src", "");
                    });
                })

        },
        "click #detail": function(e, v, row) {
            ajax_data(
                "/inventory/queryEntryStockDetail", {
                    params: { stockId: row.stockId },
                    contentType: "application/x-www-form-urlencoded;charset=utf-8"
                },
                function(res) {
                    $("#detailTable").bootstrapTable("destroy")
                    $("#detailTable").bootstrapTable({
                        striped: true, //是否显示行间隔色
                        pagination: false, //是否分页,
                        data: res,
                        height: $("body").height() < 500 ? $("body").height() - 120 : 250,
                        columns: [{
                                title: "商品名称",
                                field: "waresName"
                            },
                            {
                                title: "商品数量",
                                field: "waresCount"
                            },
                            {
                                title: "是否属于赠品",
                                field: "showName",
                            }
                        ]
                    });
                    open_html("详情信息", "#entryDetail", function() {});
                }
            );
        }
    };
    initFn();

    function queryParams(params) {
        return {
            startTime: $(".query_startTime").val() ?
                $(".query_startTime").val() : undefined
                //  ordernum: $(".query_ordernum").val()?$(".query_ordernum").val():undefined
        };
    }

    $(".addBtn").click(function() {
        isadd = true;
        open_html("添加", "#editData", function() {
            $("#editData input").val("");
            $("#editData select").val("");
            $("#editData .newShop").remove();
            $("#editData img").attr("src", "");
        });
    });

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
    $(".condition .confirmBtn").on("click", function() {
        let waresList = [];
        $(".commodity").each(function() {
            let warse = {};
            warse["waresName"] = $(this)
                .find(".name")
                .val();
            warse["waresCount"] = $(this)
                .find(".number")
                .val();
            (warse["isGift"] = 0), waresList.push(warse);
        });
        let params = {
            startTime: $(".startTime").val(), // 日期
            ordernum: $(".ordernum").val(), //订单
            totalAmount: $(".handleAmount").val(), // 应付
            payedAmount: $(".actualAmount").val(), // 实付
            fromStoreId: $(".shipper").val(), // 发货方
            toStoreId: $(".consignee").val(), // 收货放
            remark: $(".remark").val(), // 备注
            waresList: waresList, // 商品
            entryType: 2,
            transferType: $(".shipper option:selected").attr("data-type") +
                $(".consignee option:selected").attr("data-type")
        };
        let formdata = new FormData();
        formdata.append("jsonStr", JSON.stringify(params));
        if ($(".uploadimg")[0].files[0]) {
            formdata.append(
                "file",
                $(".uploadimg")[0].files[0] ? $(".uploadimg")[0].files[0] : undefined
            );
        }
        let url;

        url = "/inventory/submitEntryStock";

        file_upload(url, formdata, function(res) {
            if (res.resultCode > -1) {
                layer.close(layer.index);
                $("#importInventory").bootstrapTable("refresh");
            } else {}
        });
    });
    // 导出
    $(".exportBtn").click(function() {
        let form = $('<form id="to_export" style="display:none"></form>').attr({
            action: base + "",
            method: "post"
        });
        $("<input>")
            .attr("name", "jsonStr")
            .val($(".query_startTime").val())
            .appendTo(form);
        $("body").append(form);
        $("#to_export")
            .submit()
            .remove();
    });
})(document, window, jQuery);

function addCommodity(that) {
    let strHtml = `<div class="list_row commodity newShop">
            <div style="width: 100%;">
            <span>商品名称</span>
            <input type="text" placeholder="商品名称" class="form-control name">
            <span style="margin-left: 10px;">商品数量</span>
            <input type="text" placeholder="商品数量" class="form-control number">
            <button style=" margin-left: 10px;" onclick="deleteCommodity(this)">删除商品</button>
            </div></div>
              `;
    $(".imgdesc")
        .before(strHtml);
}

function deleteCommodity(that) {
    $(that)
        .parent()
        .parent()
        .remove();
}

// 查找门店
function queryStore() {
    ajax_data(
        "/competence/queryStoreInfo", { params: JSON.stringify({}) },
        function(res) {
            console.log(res);
            let option =
                "<option value=''>选择店铺</option><option value='0' data-type='0'>公司</option>";
            res.forEach(function(element) {
                option += `<option value="${element.storeId}" data-type="${element.storeType}" >${element.storeName}</option>`;
            });
            $(".consignee,.shipper").html(option);
        }
    );
}