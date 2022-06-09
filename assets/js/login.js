//jquery 入口函数
$(() => {
  //去注册点击事项
  $("#link_reg").on("click", () => {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  //去登录点击事项
  $("#link_login").on("click", () => {
    $(".reg-box").hide();
    $(".login-box").show();
  });
  //引入layui下面的form对象
  const form = layui.form;
  //密码校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],

    repwd: function (value) {
      let pwd = $("#form_reg [name=password]").val();
      if (pwd !== value) return "两次密码不一致";
    },
  });
  //接口根标签
  const baseUrl = "http://www.liulongbin.top:3007";
  //注册按钮事件
  $("#form_reg").on("submit", (e) => {
    //阻止默认行为
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/api/reguser",
      data: {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg [name=password]").val(),
      },
      success: (res) => {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        $("#link_login").click();
      },
    });
  });
  //登录submit 事件
  $("#form_login").on("submit", function (e) {
    e.preventDefault();
    //ajax请求
    $.ajax({
      type: "POST",
      url: "/api/login",
      data: $(this).serialize(),
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        localStorage.setItem("token", res.token);
        location.href = "/index.html";
      },
    });
  });
});
