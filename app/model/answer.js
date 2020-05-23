module.exports = app => {
    const Mongoose = app.mongoose;
    const Schema = Mongoose.Schema;
    const ObjectId = Mongoose.Schema.Types.ObjectId;
    const AnswerSchema = new Schema({
        questionId: { type: ObjectId },//问题ID
        user:{ type:ObjectId, default:"5df344b97b487d40c8b4e2c5",ref:"User"},//用户ID
        content: { type: String },  //文章内容
        like: { type: Number, default: Math.floor(Math.random() * 100) },   //文章点赞
        dislike: { type: Boolean, default: false },  //文章踩
        commentCount: { type: Number, default: 0, ref: "RootComment" },  //文章评论数量
        createdTime:{type:Date,default:Date.now}
    })

    return Mongoose.model("Answer", AnswerSchema, "answer");
}