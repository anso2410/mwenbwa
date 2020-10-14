import {nameByRace} from "fantasy-name-generator";
import Tree from "../models/tree";
import User from "../models/user";

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

exports.assignRandomFreeTrees = async (user_id) => {
    try {
        // Check free trees and assign tree random ones
        const freeTrees = await Tree.find({owner_id: null});

        if (freeTrees) {
            const threeRandomFreeTree = [];

            for (let i = 0; i < 3; i++) {
                let randomValue = Math.floor(
                    Math.random() * Math.floor(freeTrees.length),
                );
                threeRandomFreeTree.push(freeTrees[randomValue]);
                threeRandomFreeTree[i].owner_id = user_id;
            }

            await Promise.all(
                threeRandomFreeTree.map(async (tree) => {
                    exports.testName(tree.id);
                    await tree.save();
                }),
            )
                .then(() =>
                    console.log({
                        msg: "Three free trees have been assigned to the user.",
                    }),
                )
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
        const leavesInGame = await User.find().select("number_of_leaves");

        let totalAmountOfLeavesInGame = 0;

        leavesInGame.forEach((user) => {
            totalAmountOfLeavesInGame += parseInt(user.number_of_leaves);
        });

        let leavesToGiveToNewUser = Math.round(
            totalAmountOfLeavesInGame / totalAmountOfPlayers,
        );

        // Assign result to user
        return leavesToGiveToNewUser;
    } catch {
        console.log({errors: [{msg: "Server internal error."}]});
    }
};
