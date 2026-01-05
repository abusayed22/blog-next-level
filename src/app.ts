import express from "express";
import { postRouter } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import cors from 'cors'



const app = express();
app.use(express.json());

// better auth
app.all('/api/auth/{*any}', toNodeHandler(auth));

// router list
app.use('/posts',postRouter);

// cors setup
app.use(cors({
    origin:process.env.FRONTEND_URL|| "http://localhost:3000",
    credentials:true,
}))

// geting default route
app.get("/",(req,res) => {
    res.send("Hello World")
});

app.listen(5000,( ) => {
    console.log("Server is running on http://localhost:5000");

});

export {app};
