module.exports = app => {
    const Mongoose = app.mongoose;
    const Schema = Mongoose.Schema;
    const ObjectId = Mongoose.Schema.Types.ObjectId;
    const InterestingSchema = new Schema({
        user: { type: ObjectId, ref: 'User' },
        type: { type: Array }
    })
    return Mongoose.model("Interesting", InterestingSchema, "interesting");
}