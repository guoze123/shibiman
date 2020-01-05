(function(document, window, $) {
    "use strict";
    var store_type = { "1": "直营店", "2": "加盟店" };
    var store_status = { "0": "待定", "1": "营业", "-1": "停业" };
    var isadd = false; // 判断是添加还是修改
    function initFn() {
        down_list(
            ".queryStoreManager",
            "/personnel/queryEmployeeInfo",
            "选择店长",
            "telephone"
        );
        $("#exampleTableFromData").bootstrapTable({
            method: "post",
            url: baseUrl + "/competence/queryStoreInfo", //请求路径
            striped: true, //是否显示行间隔色
            pageNumber: 1, //初始化加载第一页
            pagination: true, //是否分页
            sidePagination: "client", //server:服务器端分页|client：前端分页
            pageSize: 10, //单页记录数
            pageList: [10, 20, 30], //可选择单页记录数
            height: $(window).height() - 150,
            showRefresh: false, //刷新按钮
            cache: true, // 禁止数据缓存
            search: false, // 是否展示搜索，
            queryParams: queryParams,
            columns: [{
                    title: "店铺名称",
                    field: "storeName"
                },
                {
                    title: "开店时间",
                    field: "openTime"
                },
                {
                    title: "店铺类型",
                    field: "storeType",
                    formatter: function(vlaue, row) {
                        return store_type[row.storeType];
                    }
                },
                {
                    title: "店长名称",
                    field: "store_manager"
                },
                {
                    title: "店铺状态",
                    field: "openStatus",
                    formatter: function(value, row) {
                        return store_status[row.openStatus];
                    }
                },
                {
                    title: "操作",
                    field: "publicationTime",
                    events: operateEvents,
                    formatter: operation
                }
            ]
        });
    }

    function operation(vlaue, row) {
        var html = `
    <button type="button" id="edit" class="btn btn-info btn-sm">修改</button>
    <button type="button" id="delete" class="btn btn-danger deleteBtn btn-sm">删除</button>
    `;
        return html;
    }
    var operateEvents = {
        "click #edit": function(e, v, row) {
            isadd = false;
            $(".store_name").val(row.storeName);
            $(".open_time").val(row.openTime);
            $(".store_type").val(row.storeType);
            $(".selectedValue input").attr("data-id", row.managerId);
            $(".selectedValue input").val(row.manager);
            $(".params_province").val(row.provinceId);
            $(".params_province").trigger("change");
            $(".params_city").val(row.cityId);
            $(".params_city").trigger("change");
            $(".params_area").val(row.areaId);
            $(".open_status").val(row.openStatus);
            $(".detailAddress").val(row.address);
            open_html("修改店铺信息", "#editData");
        },
        "click #delete": function(e, v, row) {
            firm("提示", "是否删除", function() {
                layer.close(layer.index);
                ajax_data(
                    "/competence/deleteStoreInfo", {
                        params: { storeId: row.storeId },
                        contentType: "application/x-www-form-urlencoded;charset=utf-8"
                    },
                    function(res) {
                        console.log(res);
                        if (res.resultCode > -1) {
                            tips("删除成功", 6);
                            $("#exampleTableFromData").bootstrapTable("refresh"); //刷新url！
                        } else {
                            tips("删除失败", 5);
                        }
                    }
                );
            });
        }
    };

    function queryParams() {
        return {
            provinceId: $(".params_province").val() ?
                $(".params_province").val() :
                undefined,
            cityId: $(".params_city").val() ? $(".params_city").val() : undefined,
            areaId: $(".params_area").val() ? $(".params_area").val() : undefined,
            storeName: $(".query_StoreName").val() ?
                $(".query_StoreName").val() :
                undefined
        };
    }
    initFn();
    // 点击查询按钮
    $("#eventqueryBtn").click(function() {
        $("#exampleTableFromData").bootstrapTable("refresh");
    });

    $(".addBtn").click(function() {
        isadd = true;
        open_html("添加店铺", "#editData", function() {
            // 关闭弹窗的回调
            $("input").val("");
            $("select").val("");
        });
    });
    // 修改信息
    $(".condition .closeBtn").on("click", function(params) {
        layer.close(layer.index);
    });
    $(".condition .confirmBtn").on("click", function() {
        let params = {
            storeId: -1,
            storeName: $(".store_name").val(),
            openTime: $(".open_time").val(),
            storeType: $(".store_type").val(),
            managerId: $(".selectedValue input").val(),
            storeManager: $(".selectedValue input").attr("data-id"),
            provinceId: $(".params_province").val(),
            cityId: $(".params_city").val(),
            areaId: $(".params_area").val(),
            openStatus: $(".open_status").val(),
            detailAddress: $(".detailAddress").val()
        };
        let url = "";
        if (isadd) {
            url = "/competence/addStoreInfo";
        } else {
            url = "/competence/modifyStoreInfo";
        }
        ajax_data(url, { params: JSON.stringify(params) }, function(res) {
            console.log(res);
            if (res.resultCode > -1) {
                layer.close(layer.index);
                $("#exampleTableFromData").bootstrapTable("refresh");
               
            } else {
                let tipsText;
                if (isadd) {
                    tipsText = "添加店铺失败";
                } else {
                    tipsText = "修改店铺失败";
                }
                tips(tipsText, 5);
            }
        });
    });
    queryProvince();
    // 查询省份
    function queryProvince() {
        ajax_data("/configuration/queryProvince", { params: {} }, function(res) {
            var option = '<option value="">选择省份</option>';
            for (let i in res) {
                option += `<option value="${res[i].id}">${res[i].name}</option>`;
            }
            $(".query_province").html(option);
            $(".params_province").html(option);
        });
    }
    // 查询市
    function queryCity(dom, params) {
        ajax_data(
            "/configuration/queryCity", { params: JSON.stringify(params), async: false },
            function(res) {
                var option = '<option value="">选择城市</option>';
                for (let i in res) {
                    option += `<option value="${res[i].id}">${res[i].name}</option>`;
                }
                $(dom).html(option);
                $(dom).change(function() {
                    if ($(this).val() == "") {
                        $(this)
                            .next()
                            .val("");
                    }
                    let newParams = params;
                    newParams["cityId"] = $(this).val();
                    queryCounty($(this).next(), newParams);
                });
            }
        );
    }

    // 查询区县
    function queryCounty(dom, params) {
        ajax_data(
            "/configuration/queryArea", { params: JSON.stringify(params), async: false },
            function(res) {
                var option = '<option value="">选择省份</option>';
                for (let i in res) {
                    option += `<option value="${res[i].id}">${res[i].name}</option>`;
                }
                dom.html(option);
            }
        );
    }
    $(".query_province").change(function() {
        if ($(this).val() == "") {
            $(".query_city,.query_county").val("");
            $(".query_city,.query_county").attr("disabled", true);
        } else {
            $(".query_city,.query_county").attr("disabled", false);
        }
        queryCity(".query_city", { provinceId: $(this).val() });
    });
    $(".params_province").change(function() {
        if ($(this).val() == "") {
            $(".params_city,.params_area").val("");
            $(".params_city,.params_area").attr("disabled", true);
        } else {
            $(".params_city,.params_area").attr("disabled", false);
        }
        queryCity(".params_city", { provinceId: $(this).val() });
    });
})(document, window, jQuery);