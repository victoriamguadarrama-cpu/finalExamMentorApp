const Course = require("../models/course-model");
const jwt = require("jsonwebtoken");

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
        .populate("trainer", "name")
        .select("-registrants")
        .lean();

        const coursesWithImageUrl = courses.map(course => {
            return {
                ...course,
                imageUrl: `${req.protocol}://${req.get("host")}/img/${course.image}`
            };
        });

        res.json(coursesWithImageUrl);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to retrieve courses" });
    }
};

exports.getToken = (req, res) => {
    try {
        const token = jwt.sign(
            {

            },
            process.env.JWT_SECRET,
            { expiresIn: "24h"} 
        );

        res.json({ token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to generate token" });
    }
};

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.query.token;

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Invalid or expired token" });
            }

            next();
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Token verification failed" });
    }
};