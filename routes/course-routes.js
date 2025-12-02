const express = require("express");
const router = express.Router();
const courseController = require("../controllers/course-controller");
const isAdmin = require("../isAdmin");

router.get("/", courseController.getCourses);


router.get("/register/:id", courseController.getRegister);
router.post("/register", courseController.postRegister);
router.post("/unregister/:id", courseController.postUnregister);

router.get("/create", isAdmin, courseController.getCreateCourse);
router.post("/create", isAdmin, courseController.postCreateCourse);


router.get("/:slug", courseController.getCourseDetails);

module.exports = router;
