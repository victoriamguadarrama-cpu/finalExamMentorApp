const axios = require("axios");

exports.getDogImage = async (req, res) => {
    try {
        const response = await axios.get("https://dog.ceo/api/breeds/image/random");

        const dogImageUrl = response.data.message;

        res.render("external-api", {
            pageTitle: "Random Dog",
            pageClass: "external-api-page",
            dogImage: dogImageUrl
        });
    } catch (err) {
        console.log(err);
        res.render("external-api", {
            pageTitle: "Random Dog",
            pageClass: "external-api-page",
            dogImage: null,
            error: "Failed to fetch dog image. Please try again"
        });
    }
};