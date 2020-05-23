module.exports = app => {
    const Mongoose = app.mongoose;
    const Schema = Mongoose.Schema;
    const ObjectId = Mongoose.Schema.Types.ObjectId;
    const FollowSchema = new Schema({
        question: { type: ObjectId },//问题ID
        user:{ type:ObjectId, default:"5df344b97b487d40c8b4e2c5",ref:"User"},//用户ID  
        isFollow:{type:Boolean,default:true}  //是否关注
    })

    return Mongoose.model("Follow", FollowSchema, "follow");
}