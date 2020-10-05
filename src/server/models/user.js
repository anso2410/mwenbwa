const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    color: {type: String, required: true},
    avatar: {type: String},
    number_of_trees: {type: Number, required: true, default: 3},
    number_of_leaves: {type: Number, required: true, default: 0},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);

/*
Story.findOne({ title: 'Casino Royale' }, function(error, story) {
  if (error) {
    return handleError(error);
  }
  story.author = author;
  console.log(story.author.name); // prints "Ian Fleming"
});
 */
