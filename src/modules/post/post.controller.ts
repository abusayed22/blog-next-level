import { Request, Response } from "express";
import { postService } from "./post.services";



const createPost = async (req:Request,res:Response) => {
    try {
        const user = req.user;
        if(!user){
            return res.status(401).json({message: "Unauthorized!"})
        }

        const result = await postService.createPost(req.body,user.id as string);
        res.status(201).json(result);
    } catch (error) {
        console.log({error});
        res.status(500).json({message: error instanceof Error ? error.message : "Internal Server Error!"})
    }
};

const getAllPosts = async(req:Request,res:Response) => {
    try {
        const {search} = req.query 
        const searchString = typeof search === 'string' ? search : ""
        const result = await postService.getAllPosts(searchString);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error instanceof Error? error.message : "Internal Server Error!"})
    }
}


export const postController = {createPost,getAllPosts}


