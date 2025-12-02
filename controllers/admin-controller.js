const Course = require("../models/course-model");
const Trainer = require("../models/trainer-model");
const User = require("../models/user-model");
const Contact = require("../models/contact-model");

exports.getCreateCourse = async (req, res) => {
    try {
        const trainers = await Trainer.find(); 
        
        res.render("create-course", {
            pageTitle: "Create Course",
            pageClass: "create-course-page",
            trainers: trainers
        });
    } catch (err) {
        console.log(err);
        res.redirect("/courses");
    }
};




exports.postCreateCourse = async (req, res) => {
    try {
        const { title, summary, description, price, capacity, trainer } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!image) {
            req.flash("error", "Image upload failed or is missing.");
            return res.redirect("/admin/create-course");
        }

        await Course.create({
            title,
            summary,
            description,
            price,
            capacity,
            trainer,
            image
        });

        req.flash("success", "Course created successfully!");
        res.redirect("/courses");

    } catch (err){
    req.flash("error", "Something went wrong. Try again.");
    res.redirect("/admin/create-course");
    }
};

exports.getEditCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findById(courseId).populate("trainer");
        const trainers = await Trainer.find();

        if (!course) {
            req.flash("error", "Course not found.");
            return res.redirect("/courses");
        }

        res.render("edit-course", {
            pageTitle: "Edit Course",
            pageClass: "edit-course-page",
            course: course,
            trainers: trainers
        });
    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to load course.");
        res.redirect("/courses");
    }
};

exports.postEditCourse = async (req, res) => {
    try {
        const { id, title, summary, description, price, capacity, trainer } = req.body;

        const course = await Course.findById(id);

        if (!course) {
            req.flash("error", "Course not found.");
            return res.redirect("/courses");
        }

        course.title = title;
        course.summary = summary;
        course.description = description;
        course.price = price;
        course.capacity = capacity;
        course.trainer = trainer;

        if (req.file) {
            course.image = req.file.filename;
        }

        await course.save();

        req.flash("success", "Course updated successfully!");
        res.redirect("/courses");
    } catch (err) {
        console.log(err);    
        req.flash("error", "Failed to update course.");
        res.redirect("/courses");
    }    
};

exports.postDeleteCourse = async (req, res) => {
    try {
        const courseId = req.body.id;

        await Course.findByIdAndDelete(courseId);

        await User.updateMany(
            { courses: courseId },
            { $pull: { courses: courseId } }
        );

        req.flash("success", "Course deleted successfully!");
        res.redirect("/courses");

    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to delete course.");
        res.redirect("/courses");
    }
};


exports.getContactList = async (req, res) => {
  try {
    const contacts = await Contact.find({ responseDate: null }).sort({ postDate: -1 });

    res.render("contact-list", {
      pageTitle: "Respond to Contacts",
      pageClass: "contact-list-page",
      contacts: contacts
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Unable to load contacts.");
    res.redirect("/");
  }
};

exports.postContactResponse = async (req, res) => {
  try {
    const { contactId, response } = req.body;

    const contact = await Contact.findById(contactId);

    if (!contact) {
      req.flash("error", "Contact not found.");
      return res.redirect("/admin/contacts");
    }

    contact.response = response;
    contact.responseDate = new Date();

    await contact.save();

    req.flash("success", "Response saved successfully!");
    res.redirect("/admin/contacts");

  } catch (err) {
    console.log(err);
    req.flash("error", "Failed to save reponse");
    res.redirect("/admin/contacts");
  }
};
