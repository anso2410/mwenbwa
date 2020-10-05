const Data = require('../models/data');
const Tree = require('../models/tree');

exports.sanitizeTrees = async (req, res, next) => {
    try {
        // Delete trees with no identification, total height and circumference from dataset
        /*const sanitizedData = await Data.deleteMany({
            $and: [
                {$or: [{arbotag: null}, {arbotag: 0}, {arbotag: undefined}]},
                {$or: [{circonf: null}, {circonf: 0}, {circonf: undefined}]},
                {$or: [{hauteur_totale: null}, {hauteur_totale: 0}, {hauteur_totale: undefined}]},
            ],
        });*/

        // Same but more complete for a weird reason
        /*
        await Data.deleteMany({arbotag: null});
        await Data.deleteMany({hauteur_totale: null});
        await Data.deleteMany({circonf: null});
        await Data.deleteMany({arbotag: 0});
        await Data.deleteMany({hauteur_totale: 0});
        await Data.deleteMany({circonf: 0});
        */

        // Find remaining trees and update info
        //const data = await Data.find();
        const trees = await Tree.find();

        //const result = await Tree.updateOne({_id: trees[0]._id}, {$unset: {full_name: ""}});

        const result = await Tree.updateOne(
            let heightInCm = trees[0].hauteur_totale * 100;
            let diameterFromCirconf = Math.round(trees[0].circonf / Math.PI);

            {_id: trees[0]._id},
            {
                $set: {
                    full_name: trees[0].nom_complet,
                    size: {
                        height: heightInCm,
                        diameter: diameterFromCirconf,
                    },
                    value: 0,
                    geoloc: {
                        lat: trees[0].geoloc.lat,
                        lon: trees[0].geoloc.lon,
                    },
                    wikipedia_page: `https://en.wikipedia.org/wiki/${trees[0].nom_complet}`,
                },
                $unset: {
                    nom_complet: "",
                    arbotag: "",
                    date_donnees: "",
                    x_lambert72: "",
                    y_lambert72: "",
                    x_lambda: "",
                    y_phi: "",
                    diametre_cime: "",
                    hauteur_totale: "",
                    circonf: "",
                },
            });

        /*
        trees.forEach(async tree => {
            if (tree.geoloc.lat === null || tree.geoloc.lat === 0 || tree.geoloc.lat === undefined)
            {
                tree.geoloc.lat = tree.y_phi;
            }

            if(tree.geoloc.lon === null || tree.geoloc.lon === 0 || tree.geoloc.lon === undefined)
            {
                tree.geoloc.lon = tree.x_lambda;
            }

            await Tree.updateOne(
                {_id: tree._id},
                {
                    $set: {
                            full_name: tree.nom_complet,
                            size: {
                                height: tree.hauteur_totale,
                                diameter: Math.round(tree.circonf / Math.PI),
                            },
                            value: tree.hauteur_totale * (Math.round(tree.circonf / Math.PI)),
                            geoloc: {
                                lat: tree.geoloc.lat,
                                lon: tree.geoloc.lon,
                            },
                            wikipedia_page: `https://en.wikipedia.org/wiki/${tree.nom_complet}`,
                        },
                    $unset: {
                        nom_complet: "",
                        arbotag: "",
                        date_donnees: "",
                        x_lambert72: "",
                        y_lambert72: "",
                        x_lambda: "",
                        y_phi: "",
                        diametre_cime: "",
                        hauteur_totale: "",
                        circonf: ""},
                });
        });*/

        /*
        const data = await Data.find();
        const trees = await Tree.find();

        for (let i = 0; i < 1; i++) {
            trees[i].full_name = data[i].nom_complet;
            trees[i].size.height = data[i].hauteur_totale * 100;
            trees[i].diameter = Math.round(data[i].circonf / Math.PI);
            trees[i].value = trees[i].size.height * trees[i].diameter;
            trees[i].geoloc.lat = data[i].geoloc.lat
                ? data[i].geoloc.lat
                : data[i].y_phi;
            trees[i].geoloc.lon = data[i].geoloc.lon
                ? data[i].geoloc.lon
                : data[i].x_lambda;
            trees[i].wikipedia_page = `https://en.wikipedia.org/wiki/${trees[i].full_name}`;

            // Unset properties for a property registered in db but not in schema
            trees[i].set('nom_complet', undefined, { strict: false });
            trees[i].set('arbotag', undefined, { strict: false });
            trees[i].set('date_donnees', undefined, { strict: false });
            trees[i].set('x_lambert72', undefined, { strict: false });
            trees[i].set('y_lambert72', undefined, { strict: false });
            trees[i].set('x_lambda', undefined, { strict: false });
            trees[i].set('y_phi', undefined, { strict: false });
            trees[i].set('diametre_cime', undefined, { strict: false });
            trees[i].set('hauteur_totale', undefined, { strict: false });
            trees[i].set('circonf', undefined, { strict: false });

            // Unset properties for a property registered in db and in schema

            trees[i].nom_complet = undefined;
            trees[i].arbotag = undefined;
            trees[i].date_donnees = undefined;
            trees[i].y_lambert72 = undefined;
            trees[i].x_lambert72 = undefined;
            trees[i].x_lambda = undefined;
            trees[i].y_phi = undefined;
            trees[i].diametre_cime = undefined;
            trees[i].hauteur_totale = undefined;
            trees[i].circonf = undefined;

            console.log(trees[i]);
        }*/

        // await trees[i].save();

        if (result != 0) {
            console.log({msg: "Dataset cleaned!"});
            res.status(200).json({msg: "Dataset cleaned!"});
        } else {
            console.log({msg: "Error!"});
            res.status(200).json({msg: "Error!"});
        }
    } catch {
        console.log({errors: [{msg: "Server internal error."}]});
        res.status(500).json({msg: "Server internal error"});
    }
};
