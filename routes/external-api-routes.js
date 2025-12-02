const express = require("express");
const router = express.Router();
const externalApiController = require("../controllers/external-api-controller");

router.get("/", externalApiController.getDogImage);

module.exports = router;