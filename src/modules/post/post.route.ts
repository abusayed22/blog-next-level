import express, { Router } from 'express';
import { postController } from './post.controller';


const route = express.Router();


route.post('/',postController.createPost);
route.get('/',postController.getAllPosts)

route.get('/',(req,res) => {
    res.send('Get all posts')
})


export const postRouter:Router = route;