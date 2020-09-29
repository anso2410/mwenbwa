// Model import
const Tree = require("../models/tree");

exports.getAllTrees = (req, res, next) => {
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
