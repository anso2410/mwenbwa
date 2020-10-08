import {nameByRace} from "fantasy-name-generator";
import Tree from "../models/tree";
import User from "../models/user";
import Gamelog from "../models/gamelog";
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
exports.testName = async (treeId) => {
    let randomIndex = Math.floor(Math.random(0, tabRace.length) * 10);
    const randomName = nameByRace(tabRace[randomIndex], {gender: "male"});
    let treeName = await Tree.findById(treeId);
    treeName.given_name = randomName;
    await treeName.save();
    console.log(treeName.given_name);
    return treeName.given_name;
};

// RECUP ID USER , ID ARBRE , FUNCTION BYAAAA

exports.buyTree = async (req, res, next) => {
    const userId = req.body.userId;
    const treeId = req.body.treeId;
    let user = await User.findById(userId);
    let tree = await Tree.findById(treeId);
    let alltree = await Tree.find();
    let userLeaves = user.number_of_leaves;
    let treeCost = tree.value;
    let treeOwner = String(tree.owner_id);
    let lock = tree.is_locked;

    if (tree.owner_id) {
        if (treeOwner === userId) {
            // res.json({msg: "you're the owner of this tree"});
            res.json({tree});
            // console.log(alltree);
        } else {
            if (lock === true) {
                res.json({msg: "you can't buy it, is LOCK"});
            } else {
                const treeAround = alltree
                    .aggregate([
                        {
                            $geoNear: {
                                near: {
                                    type: "Point",
                                    coordinates: ["5.580591", "50.651524"],
                                },
                                distanceField: "distance.calculated",
                                maxDistance: 300,
                            },
                        },
                    ])
                    .toArray();
                res.json({treeAround});
            }
        }
    } else {
        // "[value of the targetted tree"
        //  +
        // "[value of all the targetted player's trees in 100m radius]"
        //  ×
        // "[amount of trees in 100m radius]"
        //  /
        // "[amount of tree of targetted player in 100m radius]"
        //  +
        // "[value of all the other players trees in 100m radius]"
        //  -
        // "[value of all your tree in 100m radius]"
        if (userLeaves > treeCost) {
            let newName = await exports.testName(treeId);
            tree.owner_id = userId;
            user.number_of_leaves = user.number_of_leaves - treeCost;
            user.number_of_trees = user.number_of_trees + 1;
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
        }
    }
};
