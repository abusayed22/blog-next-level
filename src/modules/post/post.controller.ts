import { NextFunction, Request, Response } from "express";
import { postService } from "./post.services";
import { postStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { RoleEnum } from "../../middleware/auth/authMiddleware";



const createPost = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized!" })
        }

        const result = await postService.createPost(req.body, user.id as string);
        res.status(201).json(result);
    } catch (error) {
        next(error)
        }
};

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const tagsType = req.query.tags ? (req.query.tags as string).split(",") : [];
        const searchString = typeof search === 'string' ? search : "";

        // true or false 
        const isFeatured = req.query.isFeatured ? req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined : undefined

        const status = req.query.status as postStatus | undefined;
        
        const user_id = req.query.user_id as string | undefined;

 
        const {page,limit,skip,orderBy,order} = paginationSortingHelper(req.query)

        
        const result = await postService.getAllPosts({ search: searchString, tags: tagsType, isFeatured,status,user_id,page,limit,skip,orderBy,order });
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error!" })
    }
};


const getPostById = async(req:Request,res:Response) => {
    try{
        const {postId} = req.params;
        if(!postId){
            throw new Error("Post ID is required!")
        }
        const result = await postService.getPostById(postId);
        return res.status(200).json(result);
    }catch (error) {
        console.log({ error });
        res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error!" })
    }
};


const getMyPosts = async(req:Request,res:Response) => {
    try{
        const user = req.user;

        if(!user){
            throw new Error("The user Unauthorized!")
        }
        const result = await postService.getMyPosts(user?.id);
        return res.status(200).json(result);
    }catch (error) {
        console.log({ error });
        res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error!" })
    }
};

const updatePost = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const user = req.user;
        const {postId} = req.params;
        const isAdmin = user?.role === RoleEnum.ADMIN 


        if(!user){
            throw new Error("The user Unauthorized!")
        }
        const result = await postService.updatePost(postId as string, req.body,user?.id,isAdmin);
        return res.status(200).json(result);
    }catch (error) {
        next(error)
    }
}

const deletePost = async (req:Request,res:Response) => {
    try{
        const user = req.user;
        const {postId} = req.params;
        const isAdmin = user?.role === RoleEnum.ADMIN 


        if(!user){
            throw new Error("The user Unauthorized!")
        }
        const result = await postService.deletePost(postId as string, user?.id,isAdmin);
        return res.status(200).json(result);
    }catch (error) {
        console.log({ error });
        res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error!" })
    }
}


const getStats = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const user = req.user;
        const result = await postService.getStats();
        return res.status(200).json(result);
    }catch (error) {
        next(error)
        // console.log({ error });
        // res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error!" })
    }
}

export const postController = { createPost, getAllPosts,getPostById,getMyPosts,updatePost,deletePost,getStats }


