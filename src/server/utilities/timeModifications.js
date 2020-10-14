const Tree = require("../models/tree");
const User = require("../models/user");

const {TIME_ADD_LEAVES, TIME_REMOVE_LEAVES} = process.env;

exports.updateAddLeaves = async (req, res, next) => {
    try {
        let oldRequestHour = req.app.get('addPreviousRequestHour');
        let newRequestHour = Date.now();
        let timeInterval = newRequestHour - oldRequestHour;
        timeInterval += req.app.get('addTimeIntervalRest');
        let numberOfActions = timeInterval / TIME_ADD_LEAVES;
        let rest = timeInterval % TIME_ADD_LEAVES;
        const promises = [];

        for (let i = 1; i <= numberOfActions; i++) {
            promises.push(exports.addLeavesInterval());
        }

        req.app.set('addPreviousRequestHour', newRequestHour);
        req.app.set('addTimeIntervalRest', rest);

        console.log("ADD LEAVES");
        console.log("Old request hour: " + oldRequestHour);
        console.log("New request hour: " + newRequestHour);
        console.log("Time interval: " + timeInterval);
        console.log("Number of actions: " + numberOfActions);
        console.log("Rest: " + rest);
        console.log("Promises to be resolved: " + promises);
        console.log("Previous Request Hour: " + newRequestHour);

        Promise.all(promises)
            .then(() => {
                console.log({msg: "All interval actions are done."});
                next();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({msg: "Server internal error."});
            });
    } catch (err) {
        console.log({errors: [{msg: "Server internal error.", err}]});
        res.status(500).json({msg: "Server internal error."});
    }
};

exports.updateRemoveLeaves = async (req, res, next) => {
    try {
        let oldRequestHour = req.app.get('removePreviousRequestHour');
        let newRequestHour = Date.now();
        let timeInterval = newRequestHour - oldRequestHour;
        timeInterval += req.app.get('removeTimeIntervalRest');
        let numberOfActions = timeInterval / TIME_REMOVE_LEAVES;
        let rest = timeInterval % TIME_REMOVE_LEAVES;
        const promises = [];

        for (let i = 1; i <= numberOfActions; i++) {
            promises.push(exports.removeLeavesInterval());
        }

        req.app.set('removePreviousRequestHour', newRequestHour);
        req.app.set('removeTimeIntervalRest', rest);

        console.log("REMOVE LEAVES");
        console.log("Old request hour: " + oldRequestHour);
        console.log("New request hour: " + newRequestHour);
        console.log("Time interval: " + timeInterval);
        console.log("Number of actions: " + numberOfActions);
        console.log("Rest: " + rest);
        console.log("Promises to be resolved: " + promises);
        console.log("Previous Request Hour: " + newRequestHour);

        Promise.all(promises)
            .then(() => {
                console.log({msg: "All interval actions are done."});
                next();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({msg: "Server internal error."});
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
