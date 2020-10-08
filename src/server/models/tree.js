const mongoose = require("mongoose");

const treeSchema = new mongoose.Schema({
    full_name: {type: String, required: false},
    given_name: {type: String, required: false, default: null},
    size: {
        height: {type: Number, required: true},
        diameter: {type: Number, required: true},
    },
    value: {type: Number, required: true},
    location: {
        type: {type: String, required: true, default: "Point"},
        coordinates: [{type: Number, require: true}],
    },
    owner_id: {type: mongoose.ObjectId, ref: 'User', required: true, default: null},
    is_locked: {type: Boolean, required: true, default: false},
    transactions_history: [
        {
            content: {type: String},
            user_id: {type: mongoose.ObjectId, ref: 'User'},
            datetime: {type: Date, default: Date.now},
        },
    ],
    wikipedia_page: {type: String, default: null},
    comments: [
        {
            content: {type: String},
            user_id: {type: mongoose.ObjectId, ref: "User"},
            datetime: {type: Date, default: Date.now},
        },
    ],

    // Old schema, to be removed from tree documents once updated
    /*y_lambert72: {type: Number, required: true},
    arbotag: {type: Number, required: true},
    date_donnees: {type: Date, required: true},
    x_lambda: {type: Number, required: true},
    geoloc: {
        lat: {type: Number, required: true},
        lon: {type: Number, required: true},
    },
    hauteur_totale: {type: Number, required: true},
    x_lambert72: {type: Number, required: true},
    y_phi: {type: Number, required: true},
    nom_complet: {type: String, required: true},
    diametre_cime: {type: Number, required: true},
    circonf: {type: Number, required: true},*/
});

module.exports = mongoose.model("Tree", treeSchema);
