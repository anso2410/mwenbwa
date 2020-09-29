// Import < ES6 modules syntax, not from CommonJS, which is const express = require(''). CommonJS is the only one working for node.js, but Babel makes it possible to work with ES6 syntax for modules, even for node.
import express from "express";
import path from "path";
import connectDB from "./config/db";

// Import des routes
const treeRoutes = require("./routes/tree");
const userRoutes = require("./routes/user");

const Data = require("./models/data");
const Tree = require("./models/tree");
const User = require("./models/user");

const app = express();

// Process env variables
const {APP_PORT} = process.env;
const PORT = process.env.PORT || APP_PORT;

// Connect to MongoDB
connectDB();

// Init Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Defining Headers so the frontend can communicate with the backend
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Set le serveur statique servant le bin/client pour les fichiers dont le front (qui est statique) a besoin : tous les HTML et le CSS
// (permet d'avoir accès à l'index.html pour la route "/" notamment.
//app.use(express.static(path.resolve(__dirname, "../../bin/client")));

// API Test
app.get("/", (req, res) => {
    res.send('API Running.');
});

app.get("/users", (req, res) => {
    User.find()
        .then(users => res.status(200).json(users))
        .catch(() => res.status(400).json({error: "No user found!"}));
});

app.get("/users/:id", (req, res) => {
    User.findOne({_id: req.params.id})
        .then(user => res.status(200).json(user))
        .catch(() => res.status(400).json({error: "No user found!"}));
});

/*app.get("/api/trees/:id", (req, res) => {
    Data.findOne({ _id: req.params.id }, (err, doc) => {
        if(err)
        {
            return res.status(400).json({error: `No tree with ${req.params.id} found!`});
        }
        res.status(200).json(doc.nom_complet);
    });
});*/

app.post("/hello", (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        color: req.body.color
    });

    /*if(
        !newUser.username ||
        !newUser.email ||
        !newUser.password ||
        !newUser.color
    ) {
        return res
            .status(400)
            .json({error: "Please fill up all fiels!"});
    }*/

    // Register to DB
    newUser.save()
        .then(() => res.status(201).json({message: "User created!"}))
        .catch(error => res.status(500).json({error}));
});

app.put("/hello/:id", (req, res) => {
    const updatedUser = req.body;
    User.findOne({_id: req.params.id})
        .then(user => {
            user.username = updatedUser.username
                ? updatedUser.username
                : user.username;
            user.email = updatedUser.email ? updatedUser.email : user.email;
            user.password = updatedUser.password
                ? updatedUser.password
                : user.password;
            user.color = updatedUser.color ? updatedUser.color : user.color;
            res.status(200).json({msg: "User updated!", user});
        })
        .catch(() => res.status(400).json({error: "No user found!"}));
});

app.delete("/hello/:id", (req, res) => {
    User.deleteOne({_id: req.params.id})
        .then(data => {
            if (data.deletedCount !== 0) {
                res.status(200).json({msg: "User deleted!"});
            } else {
                res.status(500).json({
                    error: "User couldn't be deleted. Try again.",
                });
            }
        })
        .catch(() => res.status(400).json({error: "No user found!"}));
});

// Define routes
app.use("/api/tree", treeRoutes);
app.use("/api/user", userRoutes);
/*app.use("/api/leaderboard", userRoutes);
app.use("/api/gamelog", userRoutes);*/


// App listening on port
app.listen(PORT, () =>
    console.log(`🚀 Server is listening on port ${PORT}.`),
);
