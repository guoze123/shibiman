"use strict";
(function (document, window, $) {
	monthRange(".startTime",".endTime")
    function initFn() {
        $("#opinion").bootstrapTable({
            method: "post",
            url: base + "/testJson/queryEmployeeInfo.json",
            striped: true,
            pageNumber: 1,
            pagination: true,
            sidePagination: "client",
            pageSize: 20,
            pageList: [10, 20, 30, 40],
            height: $(window).height() - 150,
            showRefresh: false,
            cache: true,
            search: false,
            showLoading: true,
            sortable: true,
            sortOrder: "asc", //排序方式
            contentType: "application/x-www-form-urlencoded",
            queryParams: queryParams,
            columns: [
                {
                    title: "时间",
					field: "batchno",
					width:"150px",
                    sortable: true
                },
                {
                    title: "意见内容",
                    field: "content",
                    sortable: true
                }
            ]
        });
    }
    function queryParams() {
        return {
            startTime: $(".startTime").val().trim(),
            endTime: $(".endTime").val().trim(),
        };
    }
    initFn();

    $("#eventqueryBtn").click(function () {
        $("#opinion").bootstrapTable("refresh");
    });
})(document, window, jQuery);
