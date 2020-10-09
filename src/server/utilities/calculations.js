const User = require('../models/user');
const Tree = require('../models/tree');

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

exports.lockTree = async (req, res, next) => {
    try {
        const treeToLock = await Tree.findById(req.params.id);

        const surroundingTrees = await Tree.find({
            location: {
                $near: {
                    $maxDistance: 100,
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            treeToLock.location.coordinates[0],
                            treeToLock.location.coordinates[1],
                        ],
                    },
                },
            },
        });

        // Value of all surrounding trees
        let valueOfAllSurroundingTrees = surroundingTrees.reduce((accumulator, tree) => {
                return accumulator + parseInt(tree.value);
            }, 0); // surroundingTrees[0].value


        // Count of all surrounding users
        let listOfOwnerIds = [];
        surroundingTrees.forEach(tree => {
            if (tree.owner_id != null && !listOfOwnerIds.includes(tree.owner_id))
            {
                listOfOwnerIds.push(tree.owner_id);
            }
        });
        let amountOfPlayers = listOfOwnerIds.length;

        /*
        // Value of all surrounding trees belonging to player
        let valueOfAllSurroundingTreesOfPlayer = surroundingTrees.reduce((accumulator, tree) => {
            if (tree.owner_id === treeToLock.owner_id)
            {
                accumulator += parseInt(tree.value);
            }

            return accumulator;
        }, 0);

        const valueToPayToLockTree = (treeToLock.value * 10) + (valueOfAllSurroundingTrees * amountOfPlayers) -
            Math.round(valueOfAllSurroundingTreesOfPlayer / amountOfPlayers);*/

        console.log(valueOfAllSurroundingTrees);
        res.json({"Amount of Players": amountOfPlayers, Length: surroundingTrees.length, Value: valueOfAllSurroundingTrees, Trees: surroundingTrees});
        //res.json({msg: "Ok."});
    } catch (err) {
        console.log({errors: [{msg: "Server internal error."}]});
        res.status(500).json({ errors: [{ msg: "Server internal error"}]});
    }
};


/*
Whenever he wants, a player can lock a tree by paying the following formula:
[value of the tree] × 10 +
([value of all the trees in 100m radius] × [amount of players in 100m radius]) -
([value of all player's trees in 100m radius] / [amount of players in 100m radius]).
 */
