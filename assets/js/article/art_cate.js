$(() => {
  const initArticleCate = () => {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        let tbodyHtml = template("tpl-tbody", res);
        $(".layui-table tbody").empty().html(tbodyHtml);
      },
    });
  };
  //渲染列表
  initArticleCate();
  //添加文章分类
  let indexAdd = null; //定义弹窗索引
  $("#addClass").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });
  // 添加文章分类 确认添加 点击事项
  $("body").on("submit", "#form-add", function (e) {
    //1.阻止submit默认行为
    e.preventDefault();
    //2.发送ajax请求
    $.ajax({
      url: "/my/article/addcates",
      method: "POST",
      data: {
        name: $("#form-add [name=name]").val(),
        alias: $("#form-add [name=alias]").val(),
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg(res.message);
        //关闭弹窗
        layer.close(indexAdd);
        //如果成功，刷新页面
        initArticleCate();
      },
    });
  });
  //添加弹框 重置按钮点击事件
  $("body").on("click", "#btnReset", function () {
    $("#form-add input").val("");
  });
});
