import express from "express";
import path from "path";
import connectDB from "./config/db";

import timeModifications from "./utilities/timeModifications";

// Import des routes
const treeRoutes = require("./routes/tree");
const userRoutes = require("./routes/user");
const gamelogRoutes = require("./routes/gamelog");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express();

// Process env variables
const {APP_PORT} = process.env;
const PORT = process.env.PORT || APP_PORT;

// Setting values for time modifications
app.set("previousRequestHour", Date.now());

// Connect to MongoDB
connectDB();

// Init Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Defining Headers so the frontend can communicate with the backend
/*app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    );
    next();
});*/

// Avant de servir statiquement le serveur, on lance les fonctions de temps.
app.use("/", timeModifications.timeUpdates);

// Set le serveur statique servant le bin/client pour les fichiers dont le front (qui est statique) a besoin : tous les HTML et le CSS
// (permet d'avoir accès à l'index.html pour la route "/" notamment.
app.use(express.static(path.resolve(__dirname, "../../bin/client")));

// Define routes
app.use("/api/tree", treeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/gamelog", gamelogRoutes);

// App listening on port
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}.`));
