const mongoose = require("mongoose");

const gamelogSchema = new mongoose.Schema({
    type: {type: String, required: true},
    user_id: {
        type: mongoose.ObjectId,
        ref: "User",
        required: true,
        default: null,
    },
    tree_id: {
        type: mongoose.ObjectId,
        ref: "Tree",
        required: true,
        default: null,
    },
    message: {type: String, required: true},
    datetime: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Gamelog", gamelogSchema);
