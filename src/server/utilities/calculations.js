const User = require('../models/user');
const Tree = require('../models/tree');

const Utilities = require('../utilities/utilities');

exports.assignRandomFreeTrees = async user_id => {
    try {
        // Check free trees and assign tree random ones
        const freeTrees = await Tree.find({owner_id: null});

        if (freeTrees) {
            const threeRandomFreeTree = [];

            for(let i = 0; i < 3; i++) {
                let randomValue = Math.floor(Math.random() * Math.floor(freeTrees.length));
                threeRandomFreeTree.push(freeTrees[randomValue]);
                threeRandomFreeTree[i].owner_id = user_id;
                // A TESTER
                threeRandomFreeTree[i].given_name = Utilities.testName(threeRandomFreeTree[i].id);
            }

            await Promise.all(
                threeRandomFreeTree.map(async tree => {
                    await tree.save();
                }),
            )
                .then(() => console.log({msg: "Three free trees have been assigned to the user."}))
                .catch((err) => console.log(err));
        } else {
            console.log({errors: [{msg: "There's noo free tree anymore."}]});
        }
    } catch (err) {
        console.log({errors: [{msg: "Server internal error.", err}]});
    }
};

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
