import User from "../models/user";

exports.leaderboardLeaves = async (req, res, next) => {
    try {
        let users = await User.find().sort({number_of_leaves: -1}).limit(10);
        res.json({users});
    } catch (err) {
        console.log({errors: [{msg: "leaderbords has failed."}]});
    }
};
exports.leaderboardTrees = async (req, res, next) => {
    try {
        let users = await User.find().sort({number_of_trees: -1}).limit(10);
        res.json({users});
    } catch (err) {
        console.log({errors: [{msg: "leaderbords has failed."}]});
    }
};
