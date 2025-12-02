const Course = require("../models/course-model");
const Trainer = require("../models/trainer-model");
const User = require("../models/user-model");

exports.getCourses = async (req, res) => {
  // Get all courses
  try {
    const courses = await Course.find()
    .populate("trainer")
    .populate("registrants"); 

    res.render("courses", {
      pageTitle: "Courses",
      pageClass: "courses-page",
      courses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("500", {
      pageTitle: "500 - Server Error",
      pageClass: "error-page"
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  // Get single course
  const { slug } = req.params;
  try {
    const course = await Course.findOne({ slug })
    .populate("trainer")
    .populate("registrants");

    res.render("course-details", {
      pageTitle: "Course Details",
      pageClass: "course-details-page",
      course,
    });
  } catch (err) {
    console.log(err);
    res.status(500).render("500", {
        pageTitle: "500 - Server Error",
        pageClass: "error-page"
    });
  }
};

exports.getTopCoursesByLikes = async (limit) => {
  // get top courses for the home page
  try {
    const courses = await Course.find()
    .populate("trainer")
    .sort({ likes: -1 })
    .limit(limit);

    return courses;
  } catch (err) {
    console.log(err);
    return [];
  }
};

exports.getRegister = async (req, res) => {
  if (!req.session.isLoggedIn) {
    req.flash("error", "You must be logged in to register.");
    return res.redirect("/login");
  }

  const courseId = req.params.id;

  try {
    const selectedCourse = await Course.findById(courseId).populate("trainer");
    
 
    if (!selectedCourse) {
      req.flash("error", "Course not found.");
      return res.redirect("/courses");
    }


    if (selectedCourse.registrants.length >= selectedCourse.capacity) {
      req.flash("error", "This course is full.");
      return res.redirect(`/courses/${selectedCourse.slug}`);
    }


    const user = await User.findById(req.session.user.id);
    if (user.courses.includes(courseId)) {
      req.flash("error", "You are already registered for this course.");
      return res.redirect(`/courses/${selectedCourse.slug}`);
    }


    const courses = await Course.find().populate("trainer");

    res.render("course-register", {
      pageTitle: "Register for Course",
      pageClass: "auth-page",
      courses,
      selectedCourse
    });

  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/courses");
  }
};

exports.postRegister = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      req.flash("error", "User or course not found.");
      return res.redirect("/courses");
    }

    if (user.courses.includes(courseId)) {
      req.flash("error", "You are already registered for this course.");
      return res.redirect(`/courses/${course.slug}`);
    }

    if (course.registrants.length >= course.capacity) {
      req.flash("error", "This course is full.");
      return res.redirect(`/courses/${course.slug}`);
    }

    user.courses.push(courseId);
    course.registrants.push(userId);

    await user.save();
    await course.save();

    req.flash("success", "You have successfully registered!");
    res.redirect(`/courses/${course.slug}`);  
  } catch (err) {
    console.log(err);
    req.flash("error", "Registration failed. Please try again.");
    res.redirect("/courses");
  }
};

exports.postUnregister = async (req, res) => {

  if (!req.session.isLoggedIn) {
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }

  const userId = req.session.user.id;
  const courseId = req.params.id;

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      req.flash("error", "User or course not found.");
      return res.redirect("/courses");
    }

    user.courses = user.courses.filter(c => c.toString() !== courseId);
    course.registrants = course.registrants.filter(r => r.toString() !== userId);

    await user.save();
    await course.save();

    req.flash("success", "You have been unregistered.");
    res.redirect(`/courses/${course.slug}`);
  } catch (err) {
    console.log(err);
    req.flash("error", "Failed to unregister. Please try again.");
    res.redirect("/courses");
  }
};  


exports.getCreateCourse = async (req, res) => {
  try {
    const trainers = await Trainer.find();

    res.render("create-course", {
      pageTitle: "Create Course",
      pageClass: "auth-page",
      trainers
    });
  } catch (err) {
    console.log(err);
    req.flash("error", "Unable to load create course page.");
    res.redirect("/courses");
  }
};

exports.postCreateCourse = async (req, res) => {
  const { title, summary, description, price, capacity, trainer, schedule } = req.body;
  const image = req.file;

  if (!image) {
    req.flash("error", "Please upload an image file.");
    return res.redirect("/courses/create");
  }

  try {
    const newCourse = new Course({
      title, 
      summary, 
      description, 
      price, 
      capacity, 
      trainer, 
      schedule: schedule || "", 
      image: image.filename
    });

    await newCourse.save();

    req.flash("success", "Course created successfully!");
    res.redirect("/courses");
  } catch (err) {
    console.log(err);
    req.flash("error", "Failed to create course. Please try again.");
    res.redirect("/courses/create");
  }
};