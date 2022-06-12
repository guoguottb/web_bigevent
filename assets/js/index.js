function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      } else {
        renderAvatar(res.data);
      }
    },
    // complete: function (res) {
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.message === "身份认证失败！"
    //   ) {
    //     console.log(res);
    //     localStorage.removeItem("token");
    //     // location.href = "/login.html";
    //   }
    // },
  });
}
//获取用户信息
getUserInfo();
//渲染头像
function renderAvatar(data) {
  const name = data.nickname || data.username;
  $("#welcome").html(`欢迎 ${name}`);
  if (data.user_pic !== null) {
    $(".layui-nav-img").attr("src", data.user_pic).show();
    $(".text-avatar").hide();
  } else {
    let first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
    $(".layui-nav-img").hide();
  }
}
//退出登录
$("#btnLogout").on("click", function () {
  layer.confirm("是否确认退出?", { icon: 3, title: "提示" }, function (index) {
    //1.清除本地的token
    localStorage.removeItem("token");
    //2.跳转到login页面
    location.href = "/login.html";
    //do something
    // layer.close(index);
  });
});

function changeBgc() {
  $("#changeBgc").addClass("layui-this").siblings().removeClass("layui-this");
}
