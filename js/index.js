"use strict";

// if (
//   getCookie("phoneNumber") == null
// ) {
//   location.href = base+"/common/userLogin";
// }
var role = "1";

if (getCookie("phoneNumber") != null) {
  $(".userName").html(getCookie("employeeName"));
  $(".userJob").html(getCookie("job"));
  role = getCookie("role");
}

var phoneReg = /^1[0-9]{10}$/,
    passwordReg = /^[0-9a-zA-Z]{6,10}$/;
var user;
var urlConfig = {
  "1_0": "./component/storeManagement/storeManagement.html",
  // 店铺管理
  "2_0": "./component/inventoryManagement/importInventory.html",
  // 入库
  "2_1": "./component/inventoryManagement/Allocate.html",
  // 调拨
  "2_2": "./component/inventoryManagement/salesRecord.html",
  // 销售记录
  "3_0": "./component/personnelManagement/onboarding.html",
  // 入职
  "3_1": "./component/personnelManagement/departure.html",
  // 离职
  "4_0": "./component/spendingManagement/spending.html",
  // 开支管理
  "5_0": "./component/commodityManagement/commodity.html",
  // 商品管理
  "6_0": "./component/reportFormManagement/company.html",
  // 公司
  "6_1": "./component/reportFormManagement/store.html",
  // 店铺
  "6_2": "./component/reportFormManagement/payment.html",
  // 支付情况
  "6_3": "./component/reportFormManagement/statisticalSpending.html",
  // 开支统计
  "6_4": "./component/reportFormManagement/personal.html",
  // 个人统计
  "7_0": "./component/configurationManagement/performance.html",
  // 绩效管理
  "7_1": "./component/configurationManagement/storeTarget.html",
  // 店铺目标值
  "7_2": "./component/configurationManagement/storeGrade.html",
  // 店铺等级
  "7_3": "./component/configurationManagement/waresDiscount.html", // 商品折扣配置
  "8_0": "./component/opinionManagement/opinion.html" // 商品折扣配置

};
var icon_config = {
 
};
ajax_data( // "/competence/getCompetence",
"./testJson/login.json", {
  async: false,
  type: "get",
  params: {
    phoneNumber: getCookie("phoneNumber")
  },
  contentType: "application/x-www-form-urlencoded"
}, function (res) {
  var submenu = res.subObj;

  for (var i in submenu) {
    var arys = submenu[i].obj;
    var sbuArys = submenu[i].subObj;

    for (var k in arys) {
      for (var n in sbuArys[arys[k].id]["obj"]) {
        sbuArys[arys[k].id]["obj"][n].purview = sbuArys[arys[k].id]["subObj"][sbuArys[arys[k].id]["obj"][n].id];
        sbuArys[arys[k].id]["obj"][n].url_id = arys[k].id + "_" + sbuArys[arys[k].id]["obj"][n]["id"];
      }

      arys[k].children = sbuArys[arys[k].id]["obj"];
    }
  }

  user = res.obj;

  for (var _n in user) {
    user[_n]["menu"] = submenu[user[_n]["id"]]["obj"];

    for (var j in user[_n].menu) {
      if (user[_n].menu[j]["children"].length == 1) {
        user[_n].menu[j]["url_id"] = user[_n].menu[j]["children"][0]["url_id"];
        user[_n].menu[j]["purview"] = user[_n].menu[j]["children"][0]["purview"];
        user[_n].menu[j]["children"] = [];
      } else {
        user[_n].menu[j]["url_id"] = "";
      }
    }
  }
});
var menuAdmin = [];

if (user.length) {
  user.forEach(function (item) {
    if (item.id == role) {
      menuAdmin = item.menu;
    }
  });
}

var menuHtml = "";

for (var i = 0; i < menuAdmin.length; i++) {
  var buildChildHtml = function buildChildHtml(childrenList) {
    var childHtml = "";

    if (!childrenList.length) {
      return "";
    } else {
      for (var _i in childrenList) {
        childHtml += "\n                      <li>\n                       <a class=\"J_menuItem\" href=\"".concat(urlConfig[childrenList[_i].url_id], "?purview=").concat(childrenList[_i].purview, "&v=").concat(new Date().valueOf(), "\" data-index=\"").concat(childrenList[_i].url_id, "\">").concat(childrenList[_i].name, "</a>\n                      </li>\n                      ");
      }
    }

    return childHtml;
  };

  if (menuAdmin[i].id == "0") {
    if (menuAdmin.length) {
      $("#content-main iframe").attr("src", "main.html?purview=".concat(menuAdmin[i].purview, "&v=").concat(new Date().valueOf()));
    } else {
      $("#content-main iframe").attr("src", "");
    }

    continue;
  }

  menuHtml += "\n                  <li>\n                      <a class=\"".concat(menuAdmin[i].children.length > 0 ? "" : "J_menuItem", "\" \n                        href=\"").concat(menuAdmin[i].children.length > 0 ? "#" : "".concat(urlConfig[menuAdmin[i].url_id], "?purview=").concat(menuAdmin[i].purview), "\" data-index=\"").concat(menuAdmin[i].id, "\">\n                        <i class=\"fa ").concat(icon_config[menuAdmin[i].id], "\"></i>\n                          <span class=\"nav-label\">").concat(menuAdmin[i].name, "</span>\n                          <span class=\"fa arrow\"></span>\n                      </a>\n                      ").concat(menuAdmin[i].children.length > 0 ? " <ul class=\"nav nav-second-level\">\n                          ".concat(buildChildHtml(menuAdmin[i].children), "\n                           </ul>") : "", "\n                  </li>\n                  ");
}

$("#side-menu").append(menuHtml);

function logout() {
  ajax_data("/common/logout", {
    params: {
      phoneNumber: getCookie("phoneNumber")
    },
    type: "post",
    contentType: "application/x-www-form-urlencoded;charset=utf-8"
  }, function (res) {
    if (res.resultCode > -1) {
      delCookie("phoneNumber");
      delCookie("employeeName");
      delCookie("job");
      delCookie("ownerId");
      delCookie("employeeId");
      clearCookie();
      location.href = base + "/common/userLogin";
    }
  });
}

$("#updata_password").on("click", function () {
  layer.open({
    type: 1,
    title: "修改密码",
    maxmin: true,
    content: $("#updata_password_content"),
    //这里content
    area: ["400px", "310px"],
    end: function end() {
      // 销毁弹出时 执行
      $("#updata_password_content input").val("");
    },
    btn: ["确定", "取消"],
    yes: function yes(index, layero) {
      confirmFn();
    },
    btn2: function btn2(index, layero) {
      layer.closeAll("page");
    }
  });
});

function validationPassword(that) {
  var errStr = '<span id="password-error" class="has-error  m-b-none"><i class="fa fa-times-circle"></i>6-10位数字字母组成的字符</span>';

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

function confirmFn() {
  if (!($(".newPasswd").val().trim() && $(".passwd").val().trim())) {
    tips("将信息填写完整", 5);
    return;
  }

  if ($(".newPasswd").val().trim() == $(".passwd").val().trim()) {
    tips("新旧密码不能相同", 5);
    return;
  }

  var params = {
    phoneNumber: getCookie("phoneNumber"),
    basePasswd: $(".passwd").val().trim(),
    passwd: $(".newPasswd").val().trim()
  };
  ajax_data("/common/modifyPasswd", {
    params: JSON.stringify(params)
  }, function (res) {
    if (res.resultCode > -1) {
      tips("密码修改成功", 6);
      setTimeout(function () {
        layer.closeAll("page");
      }, 3000);
    } else {
      tips("密码修改成功", 6);
    }
  });
}