module.exports = app => {
    const Mongoose = app.mongoose;
    const Schema = Mongoose.Schema;
    const ObjectId = Mongoose.Schema.Types.ObjectId;
    const ClickSchema = new Schema({
        questionId: { type: ObjectId, ref: "Question" },//问题ID
        user: { type: ObjectId, ref: "User" },//用户ID
        count: { type: Number, default: 1, },  //文章点击次数
    })

    return Mongoose.model("Click", ClickSchema, "click");
}