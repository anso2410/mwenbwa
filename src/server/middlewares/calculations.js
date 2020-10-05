const User = require('../models/user');

// TO DO
/*exports.assignRandomFreeTrees = async (user) => {
    try {
        // Check free trees and assign tree random ones
        const totalAmountOfPlayers = await User.find().estimatedDocumentCount();
        const leavesInGame = await User.find().select('number_of_leaves');

        let totalAmountOfLeavesInGame = 0;

        leavesInGame.forEach(user => {
            totalAmountOfLeavesInGame += parseInt(user.number_of_leaves);
        });

    } catch {
        console.log({errors: [{msg: "Server internal error."}]});
    }
};*/

exports.assignNumberOfLeaves = async () => {
    try {
        // Assign number of leaves
        const totalAmountOfPlayers = await User.find().estimatedDocumentCount();
        const leavesInGame = await User.find().select('number_of_leaves');

        let totalAmountOfLeavesInGame = 0;

        leavesInGame.forEach(user => {
            totalAmountOfLeavesInGame += parseInt(user.number_of_leaves);
        });

        let leavesToGiveToNewUser = Math.round(totalAmountOfLeavesInGame / totalAmountOfPlayers);

        // Assign result to user
        return leavesToGiveToNewUser;

    } catch {
        console.log({errors: [{msg: "Server internal error."}]});
    }
};

/* three random, free tree (and some bonus leaves, following the formula: [total leaves of players] / [amount of players]) */

/*
exports.signup = (req, res, next) => {
    User.find().estimatedDocumentCount()
        .then(count => {
            let totalAmountOfPlayers = count;
            User.find()
                .then(users => {
                    let totalAmountOfLeavesInGame = users.forEach(user => totalNumberOfLeavesInGame += user.number_of_leaves);

                    bcrypt.hash(req.body.password, 10)
                        .then(hash => {
                            const user = new User({
                                username: req.body.username,
                                email: req.body.email,
                                password: hash,
                                color: req.body.color,
                                number_of_trees: 3, // calculer en fonction de table tree-user > assigner au new user 3 random free tree (tree où aucun owner)
                                number_of_leaves: Math.floor(totalAmountOfLeavesInGame / totalAmountOfPlayers)
                                });

                            if (!user.username || !user.email || !user.password || !user.color)
                            {
                                return res.status(400).json({error: 'Please fill up all fiels!'});
                            }
                            // Register to DB
                            user.save()
                                .then(() => res.status(201).json({message: 'User created!'}))
                                .catch(error => res.status(500).json({ error }));
                        })
                        .catch(error => res.status(500).json({error}));
                })
                .catch(error => res.status(500).json({error}));
            }
        )
        .catch(error => res.status(500).json({error}));
};*/
