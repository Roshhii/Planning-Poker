const router = require("express").Router();
const { User } = require("../models/user");
const { History } = require("../models/history");



router.post("/history", async (req, res) => {
    try {

        /* 
        Il va falloir gérer les données reçues d'une session et les save dans la base de données
        await new History({ ...req.body}).save(); est réservé pour le moment où on sauvegardera (show par exemple ou save)

        Il faut retrouver les données de la db history où le mail correspond à celui de l'utilisateur en cours
        */

        await History.find({ 'email': req.body.email }, 'userStory tasks votes', function (err, sessions) {
            if (err) return handleError(err);
            const userStory = sessions.userStory
            const tasks = sessions.tasks
            const votes = sessions.votes
            res.status(201).send({ 'userStory': userStory, 'tasks': tasks, 'votes': votes  });
        })

        

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;