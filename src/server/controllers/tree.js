// Model import
const Tree = require("../models/tree");
const User = require("../models/user");
const Gamelog = require("../controllers/gamelog");
const Utilities = require("../utilities/utilities");

// Middlewares
exports.getAllTrees = async (req, res, next) => {
    try {
        const allTrees = await Tree.find();
        res.status(200).json({msg: allTrees});
    } catch (err) {
        res.status(500).json({ errors: [{ msg: "Server internal error", err}]});
    }
};
/*
exports.getTreesInArea = async (req, res, next) => {
    try {
        const {lat, lon, zoom} = req.body;
        let maxDistance;

        switch(zoom) {
            case 18:
                maxDistance = 1000;
                break;
            case 17:
                maxDistance = 2000;
                break;
            case 16:
                maxDistance = 4000;
                break;
        }

        const treesInArea = await Tree.find({
            location: {
                $near: {
                    $maxDistance: maxDistance,
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            lon,
                            lat,
                        ],
                    },
                },
            },
        });

        res.status(200).json({number: treesInArea.length, msg: treesInArea});
    } catch (err) {
        console.log({errors: [{msg: "Server internal error.", err}]});
        res.status(500).json({ errors: [{ msg: "Server internal error", err}]});
    }
};
 */

exports.getOneTree = async (req, res, next) => {
    try {
        const tree = await Tree.findById(req.params.id);
        return res.status(200).json(tree);
    } catch (err) {
        return res.status(404).json({err});
    }
};

exports.updateOneThree = (req, res, next) => {
    const updatedTree = req.body;

    //use Tree.replaceOne() instead
    Tree.findOne({_id: req.params.id})
        .then(tree => {
            tree.owner_id = updatedTree.owner_id
                ? updatedTree.owner_id
                : tree.owner_id;
            tree.is_locked = updatedTree.is_locked
                ? updatedTree.is_locked
                : tree.is_locked;
            res.json({msg: "Tree updated!"});
        })
        .catch();
    // update owner - achat de l'arbre
    // update lock status (seulement sur arbres possédés)
    // update comments
};

exports.treePrice = async (req, res, next) => {
    const userId = req.body.userId;
    const treeId = req.body.treeId;
    console.log(`user id : ${userId}`);
    console.log(`tree id : ${treeId}`);
    let user = await User.findById(userId);
    let tree = await Tree.findById(treeId);
    let treeOwner = String(tree.owner_id);
    let lock = tree.is_locked;

    if (tree.owner_id) {
        if (treeOwner === userId) {
            res.json({msg: " YOURS"});

            // console.log(alltree);
        } else {
            if (lock === true) {
                res.json({msg: "LOCK"});
            } else {
                const surroundingTrees = await Tree.find({
                    location: {
                        $near: {
                            $maxDistance: 100,
                            $geometry: {
                                type: "Point",
                                coordinates: [
                                    tree.location.coordinates[0],
                                    tree.location.coordinates[1],
                                ],
                            },
                        },
                    },
                });
                // amount of tree 100m
                let amountTree = surroundingTrees.length;
                console.log(`amount of tree in 100m : ${amountTree}`);

                // value of all your tree in 100m
                let valueMyTrees = surroundingTrees
                    .filter(({owner_id}) => owner_id == userId)
                    .reduce((sum, myTree) => sum + myTree.value, 0);
                console.log(`value of all your tree in 100m : ${valueMyTrees}`);
                // value of all the targetted player's trees in 100m radius
                let allTargettedPlayerTrees = parseInt(
                    surroundingTrees
                        .filter(({owner_id}) => owner_id == treeOwner)
                        .reduce((sum, treeAdd) => sum + treeAdd.value, 0),
                );
                // + tree.value;
                console.log(
                    `value of all the targetted player's trees in 100m radius :${allTargettedPlayerTrees}`,
                );
                console.log(tree.owner_id);

                //amount of tree of targetted player in 100m radius
                let targettedPlayerTrees = surroundingTrees.filter(
                    ({owner_id}) => owner_id == treeOwner,
                );
                let numberTargettedPlayerTrees = parseInt(
                    targettedPlayerTrees.length,
                );

                console.log(
                    `number of tree for the targetted player:${numberTargettedPlayerTrees}`,
                );
                // value of all the other players trees in 100m radius
                let valueAllPlayersTree = parseInt(
                    surroundingTrees
                        .filter(({owner_id}) => owner_id)
                        .reduce((sum, treeAdd) => sum + treeAdd.value, 0),
                );

                let finalAmount =
                    parseInt(tree.value) +
                    (allTargettedPlayerTrees * amountTree) /
                    numberTargettedPlayerTrees +
                    valueAllPlayersTree -
                    valueMyTrees;

                // {owner_id: ObjectId('5f73770653ac1f0d0081566f')}
                // {owner_id: ObjectId('5f81b0c08e42093fa9e10372')}
                // dolni :   5f81b0c08e42093fa9e10372
                // MM :      5f73770653ac1f0d0181566f
                res.json({msg: finalAmount});
            }
        }
    } else {
        res.json({msg: tree.value});
    }
};

exports.showLockingPrice = async (req, res, next) => {
    try {
        const lockingPrice = await exports.calculateLockingPrice(req.params.id);
        res.status(200).json({msg: lockingPrice});
    } catch (err) {
        console.log({errors: [{msg: "Server internal error."}]});
        res.status(500).json({ errors: [{ msg: "Server internal error"}]});
    }
};

exports.buyTree = async (req, res, next) => {
    const userId = req.body.userId;
    const treeId = req.body.treeId;
    console.log(`user id : ${userId}`);
    console.log(`tree id : ${treeId}`);
    let user = await User.findById(userId);
    let tree = await Tree.findById(treeId);
    let treeOwner = String(tree.owner_id);
    let OwnerOfTree = await User.findById(tree.owner_id);
    let userLeaves = user.number_of_leaves;
    let treeCost = tree.value;

    let lock = tree.is_locked;

    if (tree.owner_id) {
        if (treeOwner === userId) {
            res.json({msg: "you're the owner of this tree"});

            // console.log(alltree);
        } else {
            if (lock === true) {
                res.json({msg: "you can't buy it, is LOCK"});
            } else {
                const surroundingTrees = await Tree.find({
                    location: {
                        $near: {
                            $maxDistance: 100,
                            $geometry: {
                                type: "Point",
                                coordinates: [
                                    tree.location.coordinates[0],
                                    tree.location.coordinates[1],
                                ],
                            },
                        },
                    },
                });
                // amount of tree 100m
                let amountTree = surroundingTrees.length;
                console.log(`amount of tree in 100m : ${amountTree}`);

                // value of all your tree in 100m
                let valueMyTrees = surroundingTrees
                    .filter(({owner_id}) => owner_id == userId)
                    .reduce((sum, myTree) => sum + myTree.value, 0);
                console.log(`value of all your tree in 100m : ${valueMyTrees}`);
                // value of all the targetted player's trees in 100m radius
                let allTargettedPlayerTrees = parseInt(
                    surroundingTrees
                        .filter(({owner_id}) => owner_id == treeOwner)
                        .reduce((sum, treeAdd) => sum + treeAdd.value, 0),
                );
                // + tree.value;
                console.log(
                    `value of all the targetted player's trees in 100m radius :${allTargettedPlayerTrees}`,
                );
                console.log(tree.owner_id);

                //amount of tree of targetted player in 100m radius
                let targettedPlayerTrees = surroundingTrees.filter(
                    ({owner_id}) => owner_id == treeOwner,
                );
                let numberTargettedPlayerTrees = parseInt(
                    targettedPlayerTrees.length,
                );

                console.log(
                    `number of tree for the targetted player:${numberTargettedPlayerTrees}`,
                );
                // value of all the other players trees in 100m radius
                let valueAllPlayersTree = parseInt(
                    surroundingTrees
                        .filter(({owner_id}) => owner_id)
                        .reduce((sum, treeAdd) => sum + treeAdd.value, 0),
                );

                let finalAmount =
                    parseInt(tree.value) +
                    (allTargettedPlayerTrees * amountTree) /
                    numberTargettedPlayerTrees +
                    valueAllPlayersTree -
                    valueMyTrees;

                if (userLeaves > finalAmount) {
                    tree.owner_id = userId;
                    user.number_of_leaves = user.number_of_leaves - finalAmount;
                    user.number_of_trees = parseInt(user.number_of_trees) + 1;
                    OwnerOfTree.number_of_trees =
                        parseInt(OwnerOfTree.number_of_trees) - 1;
                    tree.transactions_history.push({
                        user_id: userId,
                        price: finalAmount,
                    });
                    tree.transactions_history.price = finalAmount;

                    await tree.save();
                    await user.save();
                    await OwnerOfTree.save();
                    await exports.insertToGamelog(
                        "purchase",
                        userId,
                        treeId,
                        "purchased a tree",
                    );
                    await exports.insertToGamelog(
                        "purchase",
                        userId,
                        treeId,
                        "lost a tree",
                    );
                    // {owner_id: ObjectId('5f73770653ac1f0d0081566f')}
                    // {owner_id: ObjectId('5f81b0c08e42093fa9e10372')}
                    // dolni :   5f81b0c08e42093fa9e10372
                    // MM :      5f73770653ac1f0d0181566f
                    res.json({msg: "You bought this tree"});
                } else {
                    res.json({msg: "You don't have enough leaves..."});
                }
            }
        }
    } else {
        if (userLeaves > treeCost) {
            let newName = await Utilities.testName(treeId);
            tree.owner_id = userId;
            user.number_of_leaves = user.number_of_leaves - treeCost;
            user.number_of_trees = user.number_of_trees + 1;
            tree.transactions_history.user_id = userId;
            await tree.save();
            await user.save();

            //AJOUT DANS LES GAMELOGS
            let log = new Gamelog({
                type: "Purchase",
                user_id: userId,
                tree_id: treeId,
                message: `${user.username} Puchased the tree called ${newName}`,
            });
            res.json({
                msg: `${user.username} just bought a tree called ${newName}`,
            });
            await log.save();
        } else {
            res.json({msg: "You don't have enough leaves..."});
        }
    }
};

exports.lockTree = async (req, res, next) => {
    try {
        const treeToLock = await Tree.findById(req.params.id); //req.body.tree_id
        const ownerOfTreeToLock = await User.findById(treeToLock.owner_id);
        const lockingPrice = await exports.calculateLockingPrice(req.params.id);

        if (ownerOfTreeToLock.number_of_leaves >= lockingPrice) {
            ownerOfTreeToLock.number_of_leaves -= lockingPrice;
            treeToLock.is_locked = true;

            await ownerOfTreeToLock.save();
            await treeToLock.save();

            await Gamelog.insertToGamelog("Locking", ownerOfTreeToLock.id, treeToLock.id, "has been locked");

            return res.status(200).json({msg: "Tree has been locked."});
        } else {
            return res.status(500).json({ errors: [{ msg: "User doesn't have enough leaves."}]});
        }
    } catch (err) {
        res.status(500).json({ errors: [{ msg: "Tree locking has failed."}]});
    }
};

exports.addComment = async (req, res, next) => {
    const userId = req.body.userId;
    const treeId = req.body.treeId;
    const comment = req.body.comment;

    let tree = await Tree.findById(treeId);
    tree.comments.push({
        content: comment,
        user_id: userId,
    });
    await tree.save();
    res.json({msg: "Done"});
};

exports.showAllComment = async (req, res, next) => {
    // try {
    const trees = await Tree.find({comments: {$ne: []}}).select("comments");
    res.json({trees});
    // } catch (err) {
    //     console.log({errors: [{msg: "leaderbords has failed."}]});
    //     res.json({msg: "errors"});
    // }
};


// Other functions
exports.calculateLockingPrice = async treeId => {
    try {
        const treeToLock = await Tree.findById(treeId);

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
        const valueOfAllSurroundingTrees = surroundingTrees.reduce((accumulator, tree) => {
            return accumulator + parseInt(tree.value);
        }, 0);

        // Count of all surrounding users
        const listOfOwnerIds = [];
        surroundingTrees.forEach(tree => {
            if (tree.owner_id != null && !listOfOwnerIds.includes(String(tree.owner_id))) {
                listOfOwnerIds.push(String(tree.owner_id));
            }
        });
        const amountOfPlayers = listOfOwnerIds.length;

        // Value of all surrounding trees belonging to player
        const valueOfAllSurroundingTreesOfPlayer = surroundingTrees.reduce((accumulator, tree) => {
            if (String(tree.owner_id) === String(treeToLock.owner_id))
            {
                accumulator += parseInt(tree.value);
            }
            return accumulator;
        }, 0);

        const valueToPayToLockTree = (parseInt(treeToLock.value) * 10) + (valueOfAllSurroundingTrees * amountOfPlayers) -
            Math.round(valueOfAllSurroundingTreesOfPlayer / amountOfPlayers);

        return valueToPayToLockTree;

        //res.json({"Total": valueToPayToLockTree, "Amount of Players": amountOfPlayers, Length: surroundingTrees.length, Value: valueOfAllSurroundingTrees, "Value of Player's trees": valueOfAllSurroundingTreesOfPlayer, Trees: surroundingTrees});
    } catch (err) {
        console.log({errors: [{msg: "Server internal error."}]});
        //res.status(500).json({ errors: [{ msg: "Server internal error"}]});
    }
};
