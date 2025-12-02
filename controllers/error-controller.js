exports.get404 = (req, res, next) => {
    res.status(404).render("404", {
        pageTitle: "404 - Page Not Found",
        pageClass: "error-page"
    });
};

exports.get500 = (err, req, res, next) => {
  console.error("===== SERVER ERROR =====");
  console.error(err);
  console.error("========================");
  
  res.status(500).render("500", {
    pageTitle: "500 - Server Error",
    pageClass: "error-page",
  });
};