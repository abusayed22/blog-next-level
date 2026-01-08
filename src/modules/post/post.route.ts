import express, { Router } from 'express';
import { postController } from './post.controller';
import auth, { RoleEnum } from '../../middleware/auth/authMiddleware';



const route = express.Router();


route.get('/', auth(RoleEnum.ADMIN,RoleEnum.USER), postController.getAllPosts)
route.get('/:postId',postController.getPostById)
route.post('/',auth(RoleEnum.ADMIN,RoleEnum.USER), postController.createPost);




export const postRouter: Router = route;