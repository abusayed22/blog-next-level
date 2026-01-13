import express, { Router } from 'express';
import { postController } from './post.controller';
import auth, { RoleEnum } from '../../middleware/auth/authMiddleware';



const route = express.Router();


route.get('/', auth(RoleEnum.ADMIN,RoleEnum.USER), postController.getAllPosts)
route.get('/:postId',postController.getPostById)
route.post('/',auth(RoleEnum.ADMIN,RoleEnum.USER), postController.createPost);

route.get('/my/get-posts',auth(RoleEnum.USER,RoleEnum.ADMIN),postController.getMyPosts);
route.patch('/:postId',auth(RoleEnum.ADMIN,RoleEnum.USER),postController.updatePost)
route.delete('/:postId',auth(RoleEnum.ADMIN,RoleEnum.USER),postController.deletePost)
route.get('/admin/stats',auth(RoleEnum.ADMIN,RoleEnum.USER),postController.getStats)




export const postRouter: Router = route;