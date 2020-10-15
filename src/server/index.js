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

if (process.env.NODE_ENV === "production") {
    // Serve any static files
    app.use(express.static(path.join(__dirname, "client/build")));
    // Handle React routing, return all requests to React app
    app.get("*", (_req, res) => {
        res.sendFile(path.join(__dirname, "client/build", "index.html"));
    });
}
// ** MIDDLEWARE ** //
const whitelist = [
    "http://localhost:3000",
    "http://localhost:80",
    "http://localhost:8080",
    "https://floating-reaches-02343.herokuapp.com",
];
const corsOptions = {
    origin(origin, callback) {
        // eslint-disable-next-line no-console
        console.log(`** Origin of request ${origin}`);
        if (whitelist.includes(origin) || !origin) {
            // eslint-disable-next-line no-console
            console.log("Origin acceptable");
            callback(null, true);
        } else {
            // eslint-disable-next-line no-console
            console.log("Origin rejected");
            callback(new Error("Not allowed by CORS"));
        }
    },
};
// eslint-disable-next-line no-undef
app.use(cors(corsOptions));
