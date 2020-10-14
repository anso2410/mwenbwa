const Tree = require("../models/tree");
const User = require("../models/user");

const {TIME_ADD_LEAVES} = process.env;

exports.timeUpdates = async (req, res, next) => {
    try {
        let oldRequestHour = req.app.get('previousRequestHour');
        let newRequestHour = Date.now();
        let timeInterval = newRequestHour - oldRequestHour;
        let numberOfActions = timeInterval / TIME_ADD_LEAVES;
        let rest = timeInterval % TIME_ADD_LEAVES;
        const promises = [];

        for (let i = 1; i <= numberOfActions; i++) {
            promises.push(exports.addLeavesInterval());
            if (i % 4 === 0) {
                promises.push(exports.removeLeavesInterval());
            }
        }

        req.app.set('previousRequestHour', newRequestHour + rest);

        Promise.all(promises)
            .then(() => {
                console.log({msg: "All interval actions are done."});
                next();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({msg: "Server internal error.", err});
            });
    } catch (err) {
        console.log({errors: [{msg: "Server internal error.", err}]});
        res.status(500).json({msg: "Server internal error."});
    }
};

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
                console.log({msg: "Half of each player's total of leaves has been removed."});
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (err) {
        console.log({errors: [{msg: "Server internal error.", err}]});
    }
};

exports.addLeavesInterval = async () => {
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
        console.log({msg: "Leaves were added to all users."});
    } catch (err) {
        console.log({errors: [{msg: "Server internal error.", err}]});
    }
};
