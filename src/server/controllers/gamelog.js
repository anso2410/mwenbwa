// Model import
const Gamelog = require("../models/gamelog");

// Middlewares
exports.getGamelog = async (req, res, next) => {
    try {
        const gameLogs = await Gamelog.find()
            .populate('user_id tree_id')
            .sort({ datetime: 'asc'});

        res.status(200).json({msg: gameLogs});
    } catch (err) {
        res.status(500).json({ errors: [{ msg: "Generation of gamelog has failed."}]});
    }
};

// Other functions
exports.insertToGamelog = async (logType, userId, treeId, message) => {
    try {
        const newLog = new Gamelog({
            type: logType,
            user_id: userId,
            tree_id: treeId,
            message: message,
        });
        await newLog.save();

        console.log({ infos: [{ msg: "Insertion to gamelog has succeeded."}]});

    } catch (err) {
        console.log({ errors: [{ msg: "Insertion to gamelog has failed."}]});
    }
};
