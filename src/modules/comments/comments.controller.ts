import { Request, Response } from "express";
import { commentsService } from "./comments.service";



const getCommentById = async(req:Request,res:Response) => {
    try {
        const {commentId} = req.params;
        const result = await commentsService.getCommentById(commentId as string);
        res.status(200).send(result)
        } catch (error) {
        console.log(error)
    }
};


const getCommentsByAuthor = async(req:Request,res:Response) => {
    try {
        const {user_id} = req.params;
        const result = await commentsService.getCommentsByAuthor(user_id as string);
        res.status(200).send(result)
        } catch (error) {
        console.log(error)
    }
};

const updateComment = async(req:Request,res:Response) => {
    try {
        const user = req.user;
        const {commentId} = req.params

        const result = await commentsService.updateComment(user?.id as string,commentId as string,req.body);
        res.status(200).send(result)
        } catch (error) {
        console.log(error)
    }
};

const deleteComment = async(req:Request,res:Response) => {
    try {
        const user = req.user;
        const {commentId} = req.params
        const result = await commentsService.deleteComment(user?.id as string,commentId as string);
        res.status(200).send(result)
        } catch (error) {
        console.log(error)
    }
};


const createComment = async (req:Request,res:Response) => {
    try {
        const user = req.user;
         req.body.user_id = user?.id;

        const result = await commentsService.createComment(req.body);

        res.status(201).send(result)
    } catch (error) {
        console.log(error)
    }
}




export const commentsController = {
    getCommentById,
    createComment,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
}