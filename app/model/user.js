module.exports = app => {
    const Mongoose = app.mongoose;
    const Schema = Mongoose.Schema;
    const ObjectId = Mongoose.Schema.Types.ObjectId;
    const UUID=require("node-uuid")
    const UserSchema = new Schema({
        userName: { type: String, default: "用户"+UUID.v4().slice(0,6)},//用户昵称
        userImg: { type: String, default: "https://pic2.zhimg.com/ebba3f748_xs.jpg" },//用户图像
        userIntroduce: { type: String, default: "我爱你" },//用户介绍
        phone: { type: String, },
        password: { type: String, }
    })

    return Mongoose.model("User", UserSchema, "user");
}