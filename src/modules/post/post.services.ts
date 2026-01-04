import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";


const createPost = async(data:Omit<Post,'id'|'createdAt'|'updatedAt'>) => {
    // console.log(data)
    const result = await prisma.post.create({
        data:{
            title:data.title,
            content:data.content,
            user_id:data.user_id
        }
    })

    return result;
};


const getAllPosts = async() => {
    const result = await prisma.post.findMany();
    return result;
}

export const postService = {createPost,getAllPosts}