const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");

const isAdmin = (req, res, next) => {
    if (!req.session.user || !req.session.user.roles || !req.session.user.roles.includes('admin')){
        return res.redirect("/login");
    }
    next();
};

router.get("/create-course", isAdmin, adminController.getCreateCourse);
router.post("/create-course", isAdmin, adminController.postCreateCourse);

router.get("/edit-course/:id", isAdmin, adminController.getEditCourse);
router.post("/edit-course", isAdmin, adminController.postEditCourse);

router.post("/delete-course", isAdmin, adminController.postDeleteCourse);

router.get("/contacts", isAdmin, adminController.getContactList);
router.post("/contacts/respond", isAdmin, adminController.postContactResponse);

module.exports = router;

