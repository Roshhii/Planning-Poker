const router = require("express").Router();
const { User } = require("../models/user");
const { Records } = require("../models/records");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        const history = await Records.find({ 'email': req.body.email });
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" });

        console.log("User connected: " + user)
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" });

        const token = user.generateAuthToken();
        //Envoie à la racine que l'authentification s'est bien passée => OK
        res.status(200).send({ data: token, message: "Logged in successfully", user, sessions: history });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = router;