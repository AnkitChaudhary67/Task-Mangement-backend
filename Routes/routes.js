const express = require("express");
const router = new express.Router();


const controllers = require("../Controllers/auth");
const { validateToken } = require("../middleware/Authentication.js");

// routes
router.post("/register",controllers.registerUser);
router.post("/login",controllers.loginUser);

// user module
router.get("/userdetail",validateToken,controllers.getUserDetail);
router.post("/addUser",validateToken,controllers.addUser);
router.delete("/deleteUser",validateToken,controllers.deleteUser);
router.get("/getUsers",validateToken,controllers.getUsers);

// Category module
router.post("/addCategory",validateToken,controllers.addCategory);
router.put("/editCategory",validateToken,controllers.editCategory);
router.delete("/deleteCategory",validateToken,controllers.deleteCategory);
router.get("/getCategory",validateToken,controllers.getCategory);
router.post("/getCategoryDetail",validateToken,controllers.getCategoryDetail);

// Task module
router.post("/addTask",validateToken,controllers.createTask);
router.get("/getTask",validateToken,controllers.getTask);
router.put("/editTask",validateToken,controllers.editTask);
router.delete("/deleteTask",validateToken,controllers.deleteTask);
router.post("/getTaskDetail",validateToken,controllers.getTaskDetail);



router.put("/status/:id",controllers.taskstatus);




module.exports = router