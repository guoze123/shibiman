(function(document, window, $) {
    "use strict";
    var isadd = false;

    function initFn() {
        queryStore();
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
        var html = `
      <button type="button" id="edit" class="btn btn-info btn-sm editBtn">修改</button>
      <button type="button" id="edit" class="btn btn-primary btn-sm editBtn">详情</button>
      `;
        return html;
    }

    var operateEvents = {
        "click #edit": function(e, v, row) {
            $(".startTime").val(row.operationDate); // 日期
            $(".handleAmount").val(row.totalAmount); // 应付
            $(".actualAmount").val(row.payedAmount); // 实付
            $(".consignee").val(row.toStoreId); // 收货放
            $(".shipper").val(row.fromStoreId); // 发货方
            $(".remark").val(row.remark); // 备注
            $(".picList").attr("src",row.row)
            isadd = false;
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
                    str += ` <div class="list_row commodity newShop">
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
            ajax_data("", { params: JSON.stringify({ stockId: row.stockId }) }, function(res) {
                open_html("详情信息", "#detail", function() {
                })
            })
        }
    };
    initFn();

    function queryParams(params) {
        return {
            startTime: $(".query_startTime").val()?$(".query_startTime").val():undefined
                //  ordernum: $(".query_ordernum").val()?$(".query_ordernum").val():undefined
        };
    }

    $(".addBtn").click(function() {
        isadd = true;
        open_html("添加", "#editData", function() {
            $("input").val("");
            $("select").val("");
            $(".newShop").remove();
            $("img").attr("src", "");
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
            transferType: $(".shipper option:selected").attr("data-type") + $(".consignee option:selected").attr("data-type")
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
            if (res.resultCode > -1) {
                layer.close(layer.index);
                $("#importInventory").bootstrapTable("refresh");
            } else {

            }
        });
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