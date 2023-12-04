const express= require("express");
const dotenv=require("dotenv").config();
const ejs=require("ejs");
const expressLayouts=require("express-ejs-layouts");
const path=require("path");
const session=require("express-session");


const mainRouter=require("./src/routers/mainRoute");


const app = express();


app.set("view engine", "ejs");
app.set("views",path.resolve(__dirname,"./src/views"));

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.use(session({
    secret:process.env.SECRET_SESSION,
    resave:false,
    saveUninitialized:true,
    cookie:{
        //maxAge:1000*15
    }
}))

app.use(expressLayouts);
app.use("/",mainRouter);



app.listen(process.env.PORT,()=>{
    console.log(process.env.PORT+" porttan server ayaklandırıldı!")
})