/*Every fifteen minutes in real life, each player will receive an amount of leaves equals to the total of each of his trees.
    Every hour in real life, each player loose half his leaves.*/
const Tree = require("../models/tree");
const User = require("../models/user");

const { TIME_ADD_LEAVES, TIME_REMOVE_LEAVES } = process.env;
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

exports.removeLeavesInterval = async (req, res, next) => {
    try {
        let oldRequestHour = req.app.get('previousRequestHour');
        let newRequestHour = Date.now();










        req.app.set('previousRequestHour', newRequestHour);

        const users = await User.find().select("number_of_leaves");

        users.map((user) => {
            user.number_of_leaves = Math.round(user.number_of_leaves / 2);
        });

        await Promise.all(
            users.map(async user => {
                await user.save();
            }),
        )
            .then(() => {
                console.log({msg: "Half of each player's total of leaves has been removed."});
                //res.status(200).json({msg: "Half of each player's total of leaves has been removed."});
                return (req, res, next) => {
                    next();
                };
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
