const Data = require('../models/data');
const Tree = require('../models/tree');

exports.sanitizeTrees = async (req, res, next) => {
    try {
        // Delete trees with no identification, total height and circumference from dataset

        await Data.deleteMany({arbotag: null});
        await Data.deleteMany({hauteur_totale: null});
        await Data.deleteMany({circonf: null});
        await Data.deleteMany({arbotag: 0});
        await Data.deleteMany({hauteur_totale: 0});
        await Data.deleteMany({circonf: 0});


        // Find remaining trees and update info
        const trees = await Tree.find();

        trees.forEach(async tree => {
            if (tree.geoloc.lat === null || tree.geoloc.lat === 0 || tree.geoloc.lat === undefined)
            {
                tree.geoloc.lat = tree.y_phi;
            }

            if(tree.geoloc.lon === null || tree.geoloc.lon === 0 || tree.geoloc.lon === undefined)
            {
                tree.geoloc.lon = tree.x_lambda;
            }

            const heightInCm = Math.round(tree.hauteur_totale * 100);
            const diameterInCm = Math.round(tree.circonf / Math.PI);
            const treeValue = Math.round((heightInCm * diameterInCm) / 100);

            await Tree.updateOne(
                {_id: tree._id},
                {
                    $set: {
                            full_name: tree.nom_complet,
                            given_name: null,
                            size: {
                                height: heightInCm,
                                diameter: diameterInCm,
                            },
                            value: treeValue,
                            location: {
                                type: "Point",
                                coordinates: [tree.geoloc.lon, tree.geoloc.lat],
                            },
                            owner_id: null,
                            is_locked: false,
                            transactions_history: [],
                            wikipedia_page: `https://en.wikipedia.org/wiki/${tree.nom_complet}`,
                            comments: [],
                        },
                    $unset: {
                        nom_complet: "",
                        arbotag: "",
                        date_donnees: "",
                        x_lambert72: "",
                        y_lambert72: "",
                        x_lambda: "",
                        geoloc: "",
                        y_phi: "",
                        diametre_cime: "",
                        hauteur_totale: "",
                        circonf: ""},
                });
        });

        console.log({msg: "Dataset cleaned!"});
        res.status(200).json({msg: "Dataset cleaned!"});
    } catch {
        console.log({errors: [{msg: "Server internal error."}]});
        res.status(500).json({msg: "Server internal error"});
    }
};
