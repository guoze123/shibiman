(function(document, window, $) {
    "use strict";
    function initFn() {
      $("#departure").bootstrapTable({
        method: "post",
        url: baseUrl+"/personnel/queryEmployeeInfo", //请求路径
        striped: true, //是否显示行间隔色
        pageNumber: 1, //初始化加载第一页
        pagination: true, //是否分页
        sidePagination: "client", //server:服务器端分页|client：前端分页
        pageSize: 10, //单页记录数
        pageList: [10, 20, 30], //可选择单页记录数
        height:$(window).height()-150,
        showRefresh: false, //刷新按钮
        cache:true, // 禁止数据缓存
        search:false, // 是否展示搜索
        showLoading:true,
        queryParams:queryParams,
        columns: [
          {
            title: "员工工号",
            field: "id",
           
          },
          {
            title: "员工姓名",
            field: "name",
          },
          {
            title: "离职时间",
            field: "sex"
          },
          {
            title: "离职原因",
            field: "Score"
          },
          // {
          //   title: "操作",
          //   field: "publicationTime",
          //   events:operateEvents,
          //   formatter: operation //对资源进行操作,
          // }
        ]
      });
    }
  
    function operation(vlaue, row) {
      var html = `
      <button type="button" id="edit" class="btn btn-info btn-sm">修改</button>
      `;
      return html;
    }
  
   var operateEvents={
      "click #edit":function(e,v,row) {
          open_html("修改信息", '#editData');
      }
    }
    function queryParams() {
      return {
        activeStatus: "-1"
      }
  }
    initFn();
    // 点击查询按钮
    $("#eventqueryBtn").click(function() {
      $('#departure').bootstrapTable(('refresh'));
    })

    // 点击添加
    $(".addBtn").click(function() {
      open_html("添加离职人员","#editData",function(){
        $('input').val("");
      })
    })

    $(".condition .closeBtn").on("click", function(params) {
      layer.close(layer.index);
    });
    $(".condition .confirmBtn").on("click", function() {
      let params = {
        employeeId: $(".employeeId").val(), //员工id
        leaveTime: $(".leaveReason").val(),
        leaveReason:$(".leaveReason").val()
      };
      let url;
        url = "/personnel/addLeaveEmployee";
      ajax_data(url, { params: JSON.stringify(params) }, function(res) {
        console.log(res);
        if(res.resultCode>-1){
          layer.close(layer.index);
          $('#departure').bootstrapTable(('refresh'));
        }else{
          tips("添加离职人员失败",5)
        }
      });
    });

  })(document, window, jQuery);
  