
const User = require('../models/user-model');

//Get Signup
exports.getSignup = (req, res) => {
    res.render('signup', {
        pageTitle: 'Signup',
        pageClass: "auth-page",
        errorMessage: req.flash('error')[0]
    });
};

//Post Signup
exports.postSignup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
    
    if (existingUser) {
        req.flash("error", "An account with that email already exists.");
        return res.redirect("/signup");
    }

    const user = new User({
        firstName,
        lastName,
        email,
        password
    });

    await user.save();
    res.redirect("/login");
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/signup");
    } 
};

//Get LOGIN
exports.getLogin = (req, res) => {
    res.render("login", {
        pageTitle: "Login",
        pageClass: "auth-page",
        errorMessage: req.flash("error")[0],
        adminCreds: {
            email: "vnickel@gmail.com",
            password: "greatPassword23"
        }
    });
};

//Post LOGIN
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
        }

        req.session.isLoggedIn = true;
        req.session.user = {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName, 
            email: user.email,
            roles: user.roles
        };

        req.session.save((err) => {
            if (err) console.log(err);
            req.flash("success", `Welcome, ${user.firstName}!`);
            res.redirect("/");
        });
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/login");
    }
};

//Post Logout
exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.redirect("/");
    });
};

exports.getProfile = async (req, res) => {
    try {
        if (!req.session.isLoggedIn) {
            req.flash("error", "Please log in to view your profile.");
            return res.redirect("/login");
        }

        const user = await User.findById(req.session.user.id)
        .populate({
            path: "courses",
            populate: { path: "trainer" }
        });

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/");
        }

        res.render("profile", {
            pageTitle: "My Profile",
            pageClass: "profile-page",
            user: user
        });
    } catch (err) {
        console.log(err);
        res.status(500).render("500", {
            pageTitle: "500 - Server Error",
            pageClass: "error-page"
        });
    }
};