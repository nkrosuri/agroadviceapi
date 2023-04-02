const Hash = require("../utils/hash");
const Token = require("../utils/token");
const UserModel = require("../models/user.model");

class User {
    static async createUser(req, res) {
        try {
            const { fullName, email, password, userType } = req.body;
            if (!fullName || typeof fullName !== "string" || fullName.length <= 3) {
                return res.status(400).send({ error: "Full Name must be morethan 3 characters." });
            }

            if (!email || typeof email !== "string" || email.indexOf("@") === -1 || email.indexOf(".") === -1 || email.lastIndexOf(".") < email.indexOf("@") + 2) {
                return res.status(400).send({ error: "Invalid email." });
            }

            if (!password || typeof password !== "string" || password.length < 8) {
                return res.status(400).send({ error: "Password must be 8 characters." });
            }

            if (!userType || typeof userType !== "string" || !["farmer", "farm analyzer"].includes(userType)) {
                return res.status(400).send({ error: "User Type must be farmer or farm analyzer." });
            }

            const emailExist = await UserModel.findOne({ email }).lean().exec();
            if (emailExist) {
                return res.status(400).send({ error: "Email already exist." });
            }
            const hashedPassword = await Hash.hashPassword(password);
            const user = new UserModel({
                fullName,
                email,
                password: hashedPassword,
                userType
            });
            await user.save();
            const token = await Token.createToken(user._id);
            return res.send({ token });

        } catch (err) {
            console.log("User.createUser", err);
            res.status(500).send({ error: "Something went wrong" });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email }).lean().exec();
            if (!user) {
                return res.status(400).send({ error: "Invalid Email or Password." });
            }
            const validPassword = await Hash.verifyPassword(password, user.password);
            if (!validPassword) {
                return res.status(400).send({ error: "Invalid Email or Password." });
            }
            const token = await Token.createToken(user._id);
            return res.send({ token });
        } catch (err) {
            console.log("User.login", err);
            res.status(500).send({ error: "Something went wrong" });
        }
    }
}

module.exports = User;