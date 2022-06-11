//jquery 入口函数
$(() => {
  const form = layui.form;
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    newPwd: function (value) {
      if (value === $(".layui-form [name=oldPwd]").val()) {
        return "新密码和旧密码不能相同";
      }
    },
    rePwd: function (value) {
      if (value !== $(".layui-form [name=newPwd]").val()) {
        return "两次密码输入不一致";
      }
    },
  });
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        //1.清空本地的token
        localStorage.removeItem("token");
        //2.跳转到login页面
        window.parent.location.href = "/login.html";
      },
    });
  });
});
