const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { validationResult } = require('express-validator');
const { JWT_SECRET } = process.env;

const User = require("../models/user");
const calculations = require("../utilities/calculations");

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

        // Calculation of amout of leaves given to new user
        let newNumberOfLeaves = await calculations.assignNumberOfLeaves();

        // Create user
        user = new User({
            username: username,
            email: email,
            password: hash,
            color: color,
            avatar: avatar,
            number_of_leaves: newNumberOfLeaves,
        });

        // Insert new user into db
        await user.save(); // Renvoie une promesse avec le nouveau document User créé (user.id est donc accessble)

        // Calculation of free trees given to new user
        //await calculations.assignRandomFreeTrees(user.id);

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
                res.json({ msg: "User created!", user: user, token: token });
            }
            );
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: "Server error"}]});
    }
};

exports.login = async (req, res, next) => {
    // Check if any error in the form sent by frontend
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get request body from frontend
    const { email, password } = req.body;

    try {
        // Check if the user's already registered in the db
        let user = await User.findOne({email: email});

        if (!user) {
            return res.status(400).json({errors: [{msg: "Invalid credentials. User not found!"}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res
                .status(401)
                .json({error: "Invalid credentials. Password incorrect!"});
        }

        // If everything is fine, send token of identification
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
                res.status(200).json({ msg: "User logged in!", token: token });
            }
        );
    } catch(err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: "Server error"}]});
    }
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

exports.updateUser = async (req, res, next) => {
    try {
        const {username, password, color} = req.body;

        const userToUpdate = await User.findById(req.user.id); // req.params.id

        userToUpdate.username = username ? username : userToUpdate.username;

        if(password) {
            let hash = await bcrypt.hash(password, 10);
            userToUpdate.password = hash;
        } else {
            userToUpdate.password = userToUpdate.password;
        }

        userToUpdate.color = color ? color : userToUpdate.color;

        await userToUpdate.save();

        // Variante, no need, méthode .save() + recommandée car exécute full validation
        /*
        await User.updateOne(
            {_id: req.params.id}, {
            username: userToUpdate.username,
            password: userToUpdate.password,
            color: userToUpdate.color
        });*/

        res.status(200).json({msg: "User updated!", userToUpdate});
    } catch (err) {
        res.status(400).json({errors: [{msg: "No user found!"}]});
    };
}

exports.deleteUser = async (req, res, next) => {
    try {
        const response = await User.deleteOne({_id: req.params.id});
        if (response.deletedCount !== 0) {
            res.status(200).json({msg: "User deleted!"});
        } else {
            res.status(500).json({errors: [{
                msg: "User couldn't be deleted. Try again.",
            }]});
        }
    } catch(err) {
        res.status(400).json({errors: [{msg: "No user found!"}]});
    }
};
