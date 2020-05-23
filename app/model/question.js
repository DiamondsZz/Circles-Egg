module.exports = app => {
    const Mongoose = app.mongoose;
    const Schema=Mongoose.Schema;
    const ObjectId = Mongoose.Schema.Types.ObjectId;
    const QuestionSchema = new Schema({
        user: { type: ObjectId , default: "5df344b97b487d40c8b4e2c5", ref: 'User'},  //用户id
        til: { type: String },      //文章标题
        content: { type: String },  //文章内容
        text:{type: String},//纯文本
        cover: { type: String, default: "https://pic4.zhimg.com/50/v2-be5df3fe3910c4001793120fa2c9cf7e_400x224.jpg" },   //文章封面图片
        follower: { type: Number, default: 0 },
        looked: { type: Number, default: 0 },
        createdTime:{type:Date,default:Date.now},
        type:{type:Array}  //问题分类
    })

    return Mongoose.model("Question", QuestionSchema, "question");
}