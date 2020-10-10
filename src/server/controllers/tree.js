// Model import
const Tree = require("../models/tree");
const User = require("../models/user");
const Gamelog = require("../controllers/gamelog");

// Middlewares
exports.getAllTrees = (req, res, next) => {
    // Modifier cette fonction pour préciser pour quelle zone des arbres doivent être chargés
    //req.body.zoom = 16 > near, max distance = 200m
    Tree.find()
        .then(trees => res.status(200).json(trees))
        .catch(err => res.status(400).json({err}));
};

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

exports.showLockingPrice = async (req, res, next) => {
    try {
        const lockingPrice = await exports.calculateLockingPrice(req.params.id);
        res.status(200).json({msg: lockingPrice});
    } catch (err) {
        console.log({errors: [{msg: "Server internal error."}]});
        res.status(500).json({ errors: [{ msg: "Server internal error"}]});
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

/*
exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing); // Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data, et non sous forme de JSON. Le corps de la requête contient une chaîne thing , qui est simplement un objet Thing converti en chaîne. Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.
    delete thingObject._id;
    // Keyword "new" of Mongoose model creates an _id for MongoDB, so we don't need the _id created by the frontend
    const thing = new Thing({
        ...thingObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
        .then(() => res.status(201).json({message: 'Object registered!'}))
        .catch(() => res.status(400).json({error}));
};

exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ?
        {
            ...JSON.parse(req.body.thing),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
        .then(() => res.status(200).json({message: 'Object modified!'}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            const filename = thing.imageUrl.split('/images/')[1];
            //Unlink supprime fichier dans le path précisé puis appelle fonction callback à exécuter amrès : ici, le delete de l'objet
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Object deleted!'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};
*/
