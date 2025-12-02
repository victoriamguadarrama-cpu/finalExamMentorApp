const Trainer = require("../models/trainer-model");

exports.getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find();

    res.render("trainers", {
      pageTitle: "Trainers",
      pageClass: "trainers-page",
      trainers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("500", {
      pageTitle: "500 - Server Error",
      pageClass: "error-page"
    });
  }
};

exports.getTopTrainersById = async (limit) => {
  try {
    const trainers = await Trainer.find()
      .sort({ _id: 1 }) 
      .limit(limit);

      return trainers;
  } catch (err) {
    console.log(err);
    return [];
  }
};
