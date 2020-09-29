const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { validationResult } = require('express-validator');
const { JWT_SECRET } = process.env;

const User = require("../models/user");

exports.signup = async (req, res, next) => {
    // Check if any error in the form sent by frontend
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get request body from frontend
    const { username, email, password, color } = req.body;

    try {
        // Check if the user's already registered in the db
        let user = await User.findOne({email: email});
        if (user) {
            return res.status(400).json({errors: [{msg: "User already exists!"}]});
        }

        // Create a gravatar image for new user
        const avatar = gravatar.url(email, {
            s: '100',
            r: 'pg',
            d: 'mm'
        });
            // Create bcrypt hash
        let hash = await bcrypt.hash(password, 10);

        // Create user
        user = new User({
            username: username,
            email: email,
            password: hash,
            color: color,
            avatar: avatar
        });

        // Insert new user into db
        await user.save(); // Renvoie une promesse avec le nouveau document User créé (user.id est donc accessble)

        // Send directly token of authentification
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            JWT_SECRET,
            {expiresIn: "24h"},
            (err, token) => {
                if (err)
                    throw err;
                res.json({ msg: "User created!", token: token });
            }
            );
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: "Server error"}]});
    }
};

/*
exports.signup = (req, res, next) => {
    User.find().estimatedDocumentCount()
        .then(count => {
            let totalAmountOfPlayers = count;
            User.find()
                .then(users => {
                    let totalAmountOfLeavesInGame = users.forEach(user => totalNumberOfLeavesInGame += user.number_of_leaves);

                    bcrypt.hash(req.body.password, 10)
                        .then(hash => {
                            const user = new User({
                                username: req.body.username,
                                email: req.body.email,
                                password: hash,
                                color: req.body.color,
                                number_of_trees: 3, // calculer en fonction de table tree-user > assigner au new user 3 random free tree (tree où aucun owner)
                                number_of_leaves: Math.floor(totalAmountOfLeavesInGame / totalAmountOfPlayers)
                                });

                            if (!user.username || !user.email || !user.password || !user.color)
                            {
                                return res.status(400).json({error: 'Please fill up all fiels!'});
                            }
                            // Register to DB
                            user.save()
                                .then(() => res.status(201).json({message: 'User created!'}))
                                .catch(error => res.status(500).json({ error }));
                        })
                        .catch(error => res.status(500).json({error}));
                })
                .catch(error => res.status(500).json({error}));
            }
        )
        .catch(error => res.status(500).json({error}));
};*/

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({error: "User not found!"});
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res
                            .status(401)
                            .json({error: "Password incorrect!"});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            "RANDOM_TOKEN_SECRET",
                            {expiresIn: "24h"},
                        ),
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({error: err});
    }
};

exports.getOneUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({error: err});
    }
};

exports.updateUser = (req, res, next) => {
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
};

exports.deleteUser = (req, res, next) => {
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
};
