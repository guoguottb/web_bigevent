//jquery入口函数
$(function () {
  const form = layui.form;
  form.verify({
    userName: (value) => {
      if (value.length > 6) {
        return "昵称长度不能超过6个字符";
      }
    },
  });
  //用户信息
  userData = null;
  //获取用户信息
  const initUserInfo = () => {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        form.val("formTest", res.data);
        userData = res.data;
      },
    });
  };
  initUserInfo();
  //提交修改用户信息
  $(".layui-form").on("submit", function (e) {
    //阻止表单默认提交
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: form.val("formTest"),
      //data:$('.layui-form).serialize  获取表单数据
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        window.parent.getUserInfo();
      },
    });
  });
  //重置按钮
  $("#btnReset").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });
});
