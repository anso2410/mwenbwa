<<<<<<< HEAD
/*Every fifteen minutes in real life, each player will receive an amount of leaves equals to the total of each of his trees.
    Every hour in real life, each player loose half his leaves.*/
=======
>>>>>>> mikedev
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

exports.timeUpdates = async (req, res, next) => {
    try {
        let oldRequestHour = 100000; //req.app.get('previousRequestHour');
        let newRequestHour = 200000; //Date.now();
        let timeInterval = newRequestHour - oldRequestHour;
        let numberOfActions = timeInterval / TIME_ADD_LEAVES;
        let rest = timeInterval % TIME_ADD_LEAVES;
        //const promises = [];

        console.log("Old Request Hour: " + oldRequestHour);
        console.log("New Request Hour: " + newRequestHour);
        console.log("Time interval: " + timeInterval);
        console.log("Number of actions: " + numberOfActions);
        console.log("Rest: " + rest);

        for (let i = 1; i <= numberOfActions; i++) {
            //promises.push(exports.addLeavesInterval());
            console.log("Add");
            if (i % 4 === 0) {
              //  promises.push(exports.removeLeavesInterval());
                console.log("Remove");
            }
        }

        let nextRequestHour = newRequestHour + rest; //req.app.set('previousRequestHour', newRequestHour + rest);
        console.log(nextRequestHour);

        res.status(200).json({msg: "Working"});
        /*
        Promise.all(promises)
            .then(() => {
                console.log({msg: "All interval actions are done."});
                next();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({msg: "Server internal error.", err});
            });*/
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
<<<<<<< HEAD
                console.log({msg: "Half of each player's total of leaves has been removed."});
                //res.status(200).json({msg: "Half of each player's total of leaves has been removed."});
            })
            .catch((err) => {
                console.log(err);
                //res.status(500).json({msg: "Server internal error."});
            });
=======
                console.log({
                    msg:
                        "Half of each player's total of leaves has been removed.",
                });
            })
            .catch((err) => console.log(err));
>>>>>>> mikedev
    } catch (err) {
        console.log({errors: [{msg: "Server internal error.", err}]});
        //res.status(500).json({msg: "Server internal error."});
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
