import express, { Router } from 'express';
import auth, { RoleEnum } from '../../middleware/auth/authMiddleware';
import { commentsController } from './comments.controller';




const route = express.Router();

route.get('/:commentId', auth(RoleEnum.ADMIN,RoleEnum.USER), commentsController.getCommentById);
route.get('/author/:user_id', auth(RoleEnum.ADMIN,RoleEnum.USER), commentsController.getCommentsByAuthor);
route.post('/', auth(RoleEnum.ADMIN,RoleEnum.USER), commentsController.createComment);



route.patch('/:commentId', auth(RoleEnum.ADMIN,RoleEnum.USER), commentsController.updateComment);
route.delete('/:commentId', auth(RoleEnum.ADMIN,RoleEnum.USER), commentsController.deleteComment);






export const commentsRouter: Router = route;