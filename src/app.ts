import express from "express";
import { postRouter } from "./modules/post/post.route";



const app = express();
app.use(express.json());

// router list
app.use('/posts',postRouter);


// geting default route
app.get("/",(req,res) => {
    res.send("Hello World")
});

app.listen(5000,( ) => {
    console.log("Server is running on http://localhost:5000");

});

export {app};
