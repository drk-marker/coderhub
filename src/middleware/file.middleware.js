const path = require("path");
const multer = require("koa-multer");
const Jimp = require("jimp");
const { AVATAR_PATH, PICTURE_PATH } = require("../constants/file-path");

// 把文件放在uploads文件夹里，upload.single("avatar")获取key为avatar的值，路径为/upload/avatar
const avatarUpload = multer({
  dest: AVATAR_PATH,
});

const pictureUpload = multer({
  dest: PICTURE_PATH,
});

const avatarHandle = avatarUpload.single("avatar");

// upload.array  批量上传,第二个参数是最多上传几个
const pictureHandle = pictureUpload.array("picture", 9);

// 因为动态列表(多个动态,大小320)/动态详情(单个动态,大小640)/动态中图片展示(一张大图,大小1280)很多情况需要的图片大小各不相同
// 所以在上传的时候可以保存多张不同的图片(设置图片大小方法:sharp库/jimp库),这个需求的存在是因为,如果通过前端控制图片大小,即使很小
// 的图片但是服务器传来的还是很大的原图,这样是比较消耗性能的
const pictureResize = async (ctx, next) => {
  try {
    // 1.获取所有图片信息
    const files = ctx.req.files;
    for (let file of files) {
      const destPath = path.join(file.destination, file.filename);

      Jimp.read(file.path).then((image) => {
        // resize调整图片大小,Jimp.AUTO根据宽度1280自动调整高度,write写入位置
        image.resize(1280, Jimp.AUTO).write(`${destPath}-large`);
        image.resize(640, Jimp.AUTO).write(`${destPath}-middle`);
        image.resize(320, Jimp.AUTO).write(`${destPath}-small`);
      });
    }
    await next();
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  avatarHandle,
  pictureHandle,
  pictureResize,
};
