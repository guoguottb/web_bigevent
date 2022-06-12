$(() => {
  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  const q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  };
  const form = layui.form;

  const initTable = () => {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 渲染表格数据
        const htmlStr = template("tpl-table", res);
        $("thead").html(htmlStr);
        renderPage(res.total);
        if (res.data.length === 0) {
          layer.msg("暂时没有数据");
        }
      },
    });
  };
  // 初始化表格
  initTable();

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  // 定义一个查询的参数对象，将来请求数据的时候,需要将请求参数对象提交到服务器
  const initCate = () => {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        // 渲染表格数据
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 通过 layui 重新渲染表单区域的UI结构
        form.render();
      },
    });
  };
  initCate();

  //筛选按钮点击查询事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    q.cate_id = $("[name=cate_id]").val();
    q.state = $("[name=state]").val();
    // 重新初始化表格
    initTable();
  });

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    layui.laypage.render({
      elem: "pageBox", // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10], // 每页展示多少条
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        //得到当前页，以便向服务端请求对应页的数据。
        //得到每页显示的条数
        //首次不执行
        // console.log(first);
        if (!first) {
          //do something
          initTable();
        }
      },
    });
  }
  //由于删除按钮是后渲染的元素，所以绑定点击事件时，要用到事件委托
  $("thead").on("click", "#btnDelete", function () {
    var len = $("#btnDelete").length;
    const id = $(this).attr("data-id");
    // 弹出询问框
    layer.confirm(
      "是否确定删除?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        $.ajax({
          method: "GET",
          url: "/my/article/delete/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg(res.message);
            }
            layer.msg(res.message);
            if (len === 1) {
              // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
              // 页码值最小必须是 1
              q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
            }
            // 删除成功后，重新渲染表格
            initTable();
          },
        });
        layer.close(index);
      }
    );
  });
});
