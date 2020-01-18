// if (
//   getCookie("phoneNumber") == null
// ) {
//   location.href = "login.html";
// }
if (getCookie("phoneNumber") != null) {
  $(".userName").html(getCookie("employeeName"));
  $(".userJob").html(getCookie("job"));
}
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

$("#content-main iframe").attr("src", "main.html?purview=4,5,6");
var menuAdmin = user.length > 0 ? user[0]["menu"] : [];
var menuHtml = ``;
for (let i = 0; i < menuAdmin.length; i++) {
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
                       }?purview=${childrenList[i].purview}" data-index="${
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
        location.href = "login.html";
      }
    }
  );
}
