$(() => {
  const form = layui.form;
  // 初始化富文本编辑器
  initEditor();
  const initCate = () => {
    //发送ajax请求
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        //调用模板引擎，渲染数据
        let html = template("tpl-cate", res);
        $("[name=cate_id]").html(html);
        // 一定要记得调用 form.render() 方法 否则看不到页面的变化
        form.render();
      },
    });
  };
  //获取文章分类
  initCate();

  //选择封面按钮点击事项
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });
  //上传文件change事项
  $("#coverFile").on("change", function (e) {
    const files = e.target.files;
    //判断是否有文件
    if (files.length <= 0) {
      return;
    }
    //将获取到的图片转化为路径
    const newImgURL = URL.createObjectURL(files[0]);
    //更新图片
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //自定义发布状态
  let atr_state = "已发布";
  //点击了存为草稿，状态要改为 草稿
  $("#btnSave2").on("click", function () {
    atr_state = "草稿";
  });

  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    const fd = new FormData($(this)[0]);
    fd.append("state", atr_state);
    // console.log(fm.get("title"));
    // console.log(fm.get("cate_id"));
    // console.log(fm.get("content"));
    // console.log(fm.get("state"));
    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append("cover_img", blob);
        // 6. 发起 ajax 数据请求
        publistArticle(fd);
      });
  });
  const publistArticle = (fd) => {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg("文章发布成功！");
        //页面跳转 到文章列表页面
        window.parent.changeBgc();
        location.href = "/article/art_list.html";
      },
    });
  };

  // 1. 初始化图片裁剪器
  var $image = $("#image");
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };
  // 3. 初始化裁剪区域
  $image.cropper(options);
});
