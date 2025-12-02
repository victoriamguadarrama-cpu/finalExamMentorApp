// Import libraries
const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();
const flash = require("connect-flash");
const multer = require("multer");
const fs = require('fs');


// Import Middleware
const requestLogger = require("./middleware");

// Import Models
const Course = require("./models/course-model");
const Trainer = require("./models/trainer-model");

// Import Routes
const homeRoutes = require("./routes/home-routes");
const trainerRoutes = require("./routes/trainer-routes");
const eventRoutes = require("./routes/event-routes");
const courseRoutes = require("./routes/course-routes");
const contactRoutes = require("./routes/contact-routes");
const { error } = require("console");
const userRoutes = require("./routes/user-routes");
const adminRoutes = require("./routes/admin-routes");
const apiRoutes = require("./routes/api-routes");
const externalApiRoutes = require("./routes/external-api-routes");

const errorController = require("./controllers/error-controller");

const app = express();

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", "views");

// Layout settings
app.use(expressLayouts);
app.set("layout", "layout");

// Middleware
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));


const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public", "img"));  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const imgDir = path.join(__dirname, "public", "img");
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
  console.log("Created img directory at:", imgDir);
} else {
  console.log("Image directory exists at:", imgDir);
}

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};



app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions"
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.user && req.session.user.roles && req.session.user.roles.includes('admin');
  res.locals.success = (req.flash("success") || []).map(m => m.toString());
  res.locals.errorMessage = (req.flash("error") || []).map(m => m.toString());
  next();
});

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);



// Use routes
app.use("/trainers", trainerRoutes);
app.use("/events", eventRoutes);
app.use("/courses", courseRoutes);
app.use("/contacts", contactRoutes);
app.use("/", homeRoutes);
app.use(userRoutes);
app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);
app.use("/externalapi", externalApiRoutes);


app.use(errorController.get404);  
app.use(errorController.get500);



//Launch the App
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Connected to MongoDB!");

  // await mongoose.connection.db.collection('sessions').deleteMany({});
  // console.log("Cleared all sessions");


  app.listen(process.env.PORT || 3000);
})
.catch((err) => {
  console.log("MongoDB connection error:", err);
});


