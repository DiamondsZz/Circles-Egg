module.exports = app => {
    const Mongoose = app.mongoose;
    const Schema = Mongoose.Schema;
    const ObjectId = Mongoose.Schema.Types.ObjectId;
    const FollowUserSchema = new Schema({
        user: { type: ObjectId, ref: "User" },//被关注用户ID  
        fromUser: { type: ObjectId, ref: "User" },//关注用户ID
        isFollow: { type: Boolean, default: true }  //是否关注
    })

    return Mongoose.model("FollowUser", FollowUserSchema, "followUser");
}