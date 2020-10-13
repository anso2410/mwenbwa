import {nameByRace} from "fantasy-name-generator";
import Tree from "../models/tree";
import User from "../models/user";
import Gamelog, {replaceOne} from "../models/gamelog";

exports.testName = async (treeId) => {
    let tabRace = [
        "angel",
        "cavePerson",
        "darkelf",
        "demon",
        "dragon",
        "drow",
        "dwarf",
        "elf",
        "fairy",
        "gnome",
        "gobin",
        "halfdemon",
        "halfling",
        "halfelf",
        "halffairy",
        "human",
        "ogre",
        "orc",
    ];
    let randomIndex = Math.floor(Math.random(0, tabRace.length) * 10);
    const randomName = nameByRace(tabRace[randomIndex], {gender: "male"});
    let treeName = await Tree.findById(treeId);
    treeName.given_name = randomName;
    await treeName.save();
    console.log(treeName.given_name);
    return treeName.given_name;
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
            let newName = await exports.testName(treeId);
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
