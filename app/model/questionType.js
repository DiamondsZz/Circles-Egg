module.exports = app => {
    const Mongoose = app.mongoose;
    const Schema = Mongoose.Schema;
    const ObjectId = Mongoose.Schema.Types.ObjectId;
    const QuestionTypeSchema = new Schema({
        type: { type: String,}
    })

    return Mongoose.model("QuestionType",QuestionTypeSchema, "questionType");
}