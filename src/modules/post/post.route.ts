import express, { NextFunction, Request, Response, Router } from 'express';
import { postController } from './post.controller';
import { auth as betterAuth } from '../../../lib/auth';
import { boolean, string } from 'better-auth/*';
import auth, { RoleEnum } from '../../middleware/auth/authMiddleware';



const route = express.Router();


route.get('/', auth(RoleEnum.ADMIN,RoleEnum.USER), postController.getAllPosts)
route.post('/',auth(RoleEnum.ADMIN,RoleEnum.USER), postController.createPost);




export const postRouter: Router = route;