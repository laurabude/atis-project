const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);

  app.put("/api/auth/changepicture", controller.changepicture);

  app.put("/api/auth/updateusername", controller.updateusername);

  app.put("/api/auth/updatepassword", controller.updatepassword);

  app.post("/api/auth/deleteuser", controller.deleteuser);
  
  
  
  //folosim post in loc de delete pentru a putea trimite parametrii

};
