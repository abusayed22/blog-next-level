import { Request, Response } from "express";
import { postService } from "./post.services";
import { postStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";



const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized!" })
        }

        const result = await postService.createPost(req.body, user.id as string);
        res.status(201).json(result);
    } catch (error) {
        console.log({ error });
        res.status(500).json({ message: error instanceof Error ? error.message : "Internal Server Error!" })
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
}


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
}

export const postController = { createPost, getAllPosts,getPostById }


