$(() => {
  const form = layui.form;
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
  //事件委托，点击编辑按钮
  let indexEdit = null;
  $("tbody").on("click", "#btn-edit", function () {
    const id = $(this).attr("data-id");
    //打开弹窗
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    //获取数据填充到弹窗中
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        form.val("form-edit", res.data);
      },
    });
  });
  //事件委托给编辑弹窗确认按钮
  $("body").on("submit", "#form-edit", function (e) {
    //1.阻止submit默认行为
    e.preventDefault();
    //2.发送ajax请求
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: form.val("form-edit"),
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.close(indexEdit);
        initArticleCate();
      },
    });
  });
  //事件委托删除按钮
  $("tbody").on("click", "#btn-delete", function () {
    //获取id然后发出删除请求
    const id = $(this).attr("data-id");
    //确认框
    layer.confirm("是否确认删除?", function (index) {
      //发送ajax请求 删除文章分类
      $.ajax({
        url: "/my/article/deletecate/" + id,
        method: "GET",
        data: id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          layer.msg(res.message);
          //刷新页面
          initArticleCate();
        },
      });
      //do something
      layer.close(index);
    });
  });
});
