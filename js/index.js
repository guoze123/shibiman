// if (
//   getCookie("phoneNumber") == null
// ) {
//   location.href = base+"/common/userLogin";
// }
var role="1";
if (getCookie("phoneNumber") != null) {
  $(".userName").html(getCookie("employeeName"));
  $(".userJob").html(getCookie("job"));
  role=getCookie("role")
}
var phoneReg = /^1[0-9]{10}$/,
passwordReg = /^[0-9a-zA-Z]{6,10}$/;
var user;
var urlConfig = {
  "1_0": "./component/storeManagement/storeManagement.html", // 店铺管理
  "2_0": "./component/inventoryManagement/importInventory.html", // 入库
  "2_1": "./component/inventoryManagement/Allocate.html", // 调拨
  "2_2": "./component/inventoryManagement/salesRecord.html", // 销售记录
  "3_0": "./component/personnelManagement/onboarding.html", // 入职
  "3_1": "./component/personnelManagement/departure.html", // 离职
  "4_0": "./component/spendingManagement/spending.html", // 开支管理
  "5_0": "./component/commodityManagement/commodity.html", // 商品管理
  "6_0": "./component/reportFormManagement/company.html", // 公司
  "6_1": "./component/reportFormManagement/store.html", // 店铺
  "6_2": "./component/reportFormManagement/payment.html", // 支付情况
  "6_3": "./component/reportFormManagement/statisticalSpending.html", // 开支统计
  "6_4": "./component/reportFormManagement/personal.html", // 个人统计
  "7_0": "./component/configurationManagement/performance.html", // 绩效管理
  "7_1": "./component/configurationManagement/storeTarget.html", // 店铺目标值
  "7_2": "./component/configurationManagement/storeGrade.html", // 店铺等级
  "7_3": "./component/configurationManagement/waresDiscount.html" // 商品折扣配置
};
var icon_config = {
  "1": "fa-building",
  "2": "",
  "3": "fa-users",
  "4": "fa-",
  "5": "",
  "6": "fa-bar-chart-o",
  "7": "fa-cogs  "
};
ajax_data(
  // "/competence/getCompetence",
  "./testJson/login.json",
  {
    async: false,
    type: "get",
    params: { phoneNumber: getCookie("phoneNumber") },
    contentType: "application/x-www-form-urlencoded"
  },
  function(res) {
    var submenu = res.subObj;
    for (let i in submenu) {
      let arys = submenu[i].obj;
      let sbuArys = submenu[i].subObj;
      for (let k in arys) {
        for (let n in sbuArys[arys[k].id]["obj"]) {
          sbuArys[arys[k].id]["obj"][n].purview =
            sbuArys[arys[k].id]["subObj"][sbuArys[arys[k].id]["obj"][n].id];
          sbuArys[arys[k].id]["obj"][n].url_id =
            arys[k].id + "_" + sbuArys[arys[k].id]["obj"][n]["id"];
        }
        arys[k].children = sbuArys[arys[k].id]["obj"];
      }
    }
    user = res.obj;
    for (let n in user) {
      user[n]["menu"] = submenu[user[n]["id"]]["obj"];
      for (let j in user[n].menu) {
        if (user[n].menu[j]["children"].length == 1) {
          user[n].menu[j]["url_id"] = user[n].menu[j]["children"][0]["url_id"];
          user[n].menu[j]["purview"] =
            user[n].menu[j]["children"][0]["purview"];
          user[n].menu[j]["children"] = [];
        } else {
          user[n].menu[j]["url_id"] = "";
        }
      }
    }
  }
);


let menuAdmin=[];
if(user.length){
  user.forEach(function(item) {
    if(item.id == role){
      menuAdmin=item.menu
    }
  })
}
var menuHtml = ``;
for (let i = 0; i < menuAdmin.length; i++) {
  if(menuAdmin[i].id == "0"){
    if(menuAdmin.length){
      $("#content-main iframe").attr("src", `main.html?purview=${menuAdmin[i].purview}&v=${new Date().valueOf()}`);
      
    }else{
      $("#content-main iframe").attr("src", "");
    }
    continue 
  }

  function buildChildHtml(childrenList) {
    let childHtml = "";
    if (!childrenList.length) {
      return "";
    } else {
      for (let i in childrenList) {
        childHtml += `
                      <li>
                       <a class="J_menuItem" href="${
                         urlConfig[childrenList[i].url_id]
                       }?purview=${childrenList[i].purview}&v=${new Date().valueOf()}" data-index="${
          childrenList[i].url_id
        }">${childrenList[i].name}</a>
                      </li>
                      `;
      }
    }
    return childHtml;
  }
  menuHtml += `
                  <li>
                      <a class="${
                        menuAdmin[i].children.length > 0 ? "" : "J_menuItem"
                      }" 
                        href="${
                          menuAdmin[i].children.length > 0
                            ? "#"
                            : `${urlConfig[menuAdmin[i].url_id]}?purview=${
                                menuAdmin[i].purview
                              }`
                        }" data-index="${menuAdmin[i].id}">
                        <i class="fa ${icon_config[menuAdmin[i].id]}"></i>
                          <span class="nav-label">${menuAdmin[i].name}</span>
                          <span class="fa arrow"></span>
                      </a>
                      ${
                        menuAdmin[i].children.length > 0
                          ? ` <ul class="nav nav-second-level">
                          ${buildChildHtml(menuAdmin[i].children)}
                           </ul>`
                          : ""
                      }
                  </li>
                  `;
}
$("#side-menu").append(menuHtml);
function logout() {
  ajax_data(
    "/common/logout",
    {
      params: {
        phoneNumber: getCookie("phoneNumber")
      },
      type: "post",
      contentType: "application/x-www-form-urlencoded;charset=utf-8"
    },
    function(res) {
      if (res.resultCode > -1) {
        delCookie("phoneNumber");
        delCookie("employeeName");
        delCookie("job");
        delCookie("ownerId");
        delCookie("employeeId");
        clearCookie();
        location.href = base+"/common/userLogin";
      }
    }
  );
}


$("#updata_password").on("click",function () { 
  layer.open({
    type: 1,
    title: "修改密码",
    maxmin: true,
    content: $("#updata_password_content",), //这里content
    area: ["400px", "310px"],
    end: function() {
      // 销毁弹出时 执行
      $("#updata_password_content input").val("");
    },
    btn: ["确定", "取消"],
    yes: function(index, layero) {
      confirmFn()
    },
    btn2: function(index, layero) {
      layer.closeAll("page");
    }
  });
})

function validationPassword(that) {
  let errStr =
      '<span id="password-error" class="has-error  m-b-none"><i class="fa fa-times-circle"></i>6-10位数字字母组成的字符</span>';
  if ($(that).val()) {
      if (passwordReg.test($(that).val())) {
        $(that).parent().next().find(".has-error").remove();
      } else {
          $(that).parent().next().html(errStr);
      }
  } else {
    $(that).parent().next().find(".has-error").remove();
  }
}

function confirmFn(){ 
    if( !($(".newPasswd").val().trim() && $(".passwd").val().trim()) ){
      tips("将信息填写完整",5)
      return
    }
    if($(".newPasswd").val().trim()  ==  $(".passwd").val().trim() ){
      tips("新旧密码不能相同",5)
      return
    }
    let params={
      phoneNumber:getCookie("phoneNumber"),
      basePasswd: $(".passwd").val().trim(),
      passwd:$(".newPasswd").val().trim()
    }
    ajax_data("/common/modifyPasswd",{params:JSON.stringify(params)},function (res) {
      if(res.resultCode > -1){
        tips("密码修改成功",6)
        setTimeout(function () { layer.closeAll("page"); },3000)
      }else{
        tips("密码修改成功",6)
      }
    })
}


