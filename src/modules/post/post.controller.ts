import { Request, Response } from "express";
import { postService } from "./post.services";



const createPost = async (req:Request,res:Response) => {
    try {
        const result = await postService.createPost(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.log({error});
        res.status(500).json({message: error instanceof Error ? error.message : "Internal Server Error!"})
    }
};

const getAllPosts = async(req:Request,res:Response) => {
    try {
        const result = await postService.getAllPosts();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error instanceof Error? error.message : "Internal Server Error!"})
    }
}


export const postController = {createPost,getAllPosts}


