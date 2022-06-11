//jquery 入口函数
$(() => {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);
  //模拟点击上传按钮
  $("#btnChooseImage").click(() => {
    $("#file").click();
  });
  $("#file").on("change", function (e) {
    const filesLength = e.target.files.length;
    if (filesLength <= 0) {
      return;
    }
    // 1. 拿到用户选择的文件
    let file = e.target.files[0];
    // 2. 将文件，转化为路径
    var imgURL = URL.createObjectURL(file);
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", imgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });
  $("#btnSure").on("click", function () {
    // 1、拿到用户裁切之后的头像
    // 直接复制代码即可
    const dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png");
    // 2、发送 ajax 请求，发送到服务器
    $.ajax({
      method: "POST",
      url: "/my/update/avatar",
      data: {
        avatar: dataURL,
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("上传失败");
        }
        layer.msg("上传成功");
        //重新渲染index.html页面的头像
        window.parent.getUserInfo();
      },
    });
  });
});
