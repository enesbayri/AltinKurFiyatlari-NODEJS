const router=require("express").Router();
const mainController=require("../controllers/mainController");





router.get("/",mainController.Girisekrani);

router.post("/login",mainController.login);

module.exports=router;