module.exports = app => {
    const Mongoose = app.mongoose;
    const Schema = Mongoose.Schema;
    const ObjectId = Mongoose.Schema.Types.ObjectId;
    const ChildCommentSchema = new Schema({
        commentId: { type: ObjectId, default: '5df347ce492af23ebc4b3e8b' },//父级评论id
        userCommented: { type: ObjectId, default: '5df344b97b487d40c8b4e2c5', ref: 'User' },//被评论用户id
        user: { type: ObjectId, default: '5df348057b487d40c8b4e2c6', ref: 'User' },//用户id
        content: { type: String },  //评论内容
        like: { type: Number, default: Math.floor(Math.random() * 100) },   //评论点赞
        dislike: { type: Boolean, default: false },  //评论踩
        createdTime:{type:Date,default:Date.now}
    })

    return Mongoose.model("ChildComment", ChildCommentSchema, "childComment");
}