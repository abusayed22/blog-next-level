import { Post, postStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../../lib/prisma";


const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>, userId: string) => {
    // console.log(data)
    const result = await prisma.post.create({
        data: {
            ...data,
            user_id: userId
        }
    })

    return result;
};



// GET all posts with search's content,title, tags and filter with tags
const getAllPosts = async ({ search, tags,isFeatured,status,user_id }: { search: string, tags: string[],isFeatured:boolean |undefined, status:postStatus|undefined ,user_id: string| undefined}) => {

    const andCondtions:PostWhereInput[] = [];

    if (search) {
        andCondtions.push(
            {
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        content: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        tags: {
                            has: search
                        }
                    }
                ],
            }
        )
    };

    if (tags.length > 0) {
        andCondtions.push(
            {
                tags: {
                    hasEvery: tags
                }
            }
        )
    };

    if(typeof isFeatured === 'boolean'){
        andCondtions.push({isFeatured})
    }

    // if(status === 'PUBLISHED' || status === 'DRAFT' || status === 'ARCHIVED'){ TODO: improve this check
    if(status){
        andCondtions.push({status})
    }

    if(user_id){
        andCondtions.push({user_id})
    }

    const result = await prisma.post.findMany(
        {
            where: {
                // search with containts in title or content or tags
                // search && or 
                AND: andCondtions
            }
        }
    );
    return result;
}

export const postService = { createPost, getAllPosts }