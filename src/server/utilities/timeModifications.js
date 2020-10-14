const Tree = require("../models/tree");
const User = require("../models/user");

const {TIME_ADD_LEAVES, TIME_REMOVE_LEAVES} = process.env;
/*
exports.addLeavesInterval = async () => {
    try {
        const users = await User.find();

        users.map((user) => {

        });
    } catch (err) {
        console.log({errors: [{msg: "Server internal error.", err}]});
    }
};*/

exports.removeLeavesInterval = async () => {
    try {
        const users = await User.find().select("number_of_leaves");

        users.map((user) => {
            user.number_of_leaves = Math.round(user.number_of_leaves / 2);
        });

        await Promise.all(
            users.map(async (user) => {
                await user.save();
            }),
        )
            .then(() => {
                console.log({
                    msg:
                        "Half of each player's total of leaves has been removed.",
                });
            })
            .catch((err) => console.log(err));
    } catch (err) {
        console.log({errors: [{msg: "Server internal error.", err}]});
    }
};

exports.leavesDistribution = async (req, res, next) => {
    try {
        let users = await User.find();
        await Promise.all(
            users.map(async (user) => {
                let singleUser = await User.findById(user.id);
                const trees = await Tree.find({owner_id: singleUser.id});
                const treesValue = trees.reduce(
                    (sum, treeAdd) => sum + treeAdd.value,
                    0,
                );
                singleUser.number_of_leaves =
                    singleUser.number_of_leaves + treesValue;
                await singleUser.save();
            }),
        );

        res.json({msg: "ok"});
    } catch (err) {
        console.log({errors: [{msg: "Server internal error.", err}]});
    }
};
