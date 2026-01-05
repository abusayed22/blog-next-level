import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";


const createPost = async(data:Omit<Post,'id'|'createdAt'|'updatedAt'|'user_id'>,userId: string) => {
    // console.log(data)
    const result = await prisma.post.create({
        data:{
            title:data.title,
            content:data.content,
            user_id:userId
        }
    })

    return result;
};


const getAllPosts = async(search:string) => {

    const result = await prisma.post.findMany(
        {
            where: {
                title: {
                    contains: search,
                    mode:"insensitive"
                }
            }
        }
    );
    return result;
}

export const postService = {createPost,getAllPosts}