const mongoose = require("mongoose");

const treeSchema = new mongoose.Schema({
    full_name: {type: String, required: true},
    given_name: {type: String, required: true, default: null},
    size: {
        height: {type: Number, required: true},
        circumference: {type: Number, required: true},
    },
    value: {type: Number, required: true},
    geoloc: {
        lat: {type: Number, required: true},
        lon: {type: Number, required: true},
    },
    owner_id: {type: String, required: true, default: null},
    is_locked: {type: Boolean, required: true, default: false},
    transactions_history: {type: Number, default: null},
    wikipedia_page: {type: String, default: null},
    comments: {
        content: {type: String},
        user_id: {type: String},
        datetime: {type: Date, default: Date.now},
    },
});

module.exports = mongoose.model("Tree", treeSchema);
