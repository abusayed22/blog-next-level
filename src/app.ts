import express from "express";
import { postRouter } from "./modules/post/post.route";
import { toNodeHandler } from "better-auth/node";
import cors from 'cors'
import { auth } from "../lib/auth";
import { commentsRouter } from "./modules/comments/comment.route";
import errorHandler from "./middleware/err/globalErrorHandler";
import notFound from "./middleware/err/notFound";


const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Ensure no trailing slash
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};



const app = express();

app.use(cors({
    origin: ["http://localhost:3000"], // আপনার ফ্রন্টএন্ডের URL
    credentials: true, // এটা true না দিলে লগইন হবে না (কুকি ব্লক হবে)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use(express.json());

// better auth
app.all('/api/auth/{*any}', toNodeHandler(auth));

// router list
app.use('/posts',postRouter);
app.use('/comments',commentsRouter);



// geting default route
app.get("/",(req,res) => {
    res.send("Hello World")
});

app.listen(5000,( ) => {
    console.log("Server is running on http://localhost:5000");

});


// not found error
app.use(notFound)
// global error handler
app.use(errorHandler);


export {app};
