import { commentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";



const getCommentById = async(id:string) => {
    const commentData = await prisma.comment.findUnique({
        where: {
            id,
        },
        include: {
            post:{
                select: {
                    id:true,
                    title: true
                }
            }
        }
    });

    return commentData;;
};


const updateComment = async(user_id:string,id:string,data:{comment?:string,status?:commentStatus}) => {
    const checkComment = await prisma.comment.findFirst({
        where: {
            id,
            user_id
        },
        select:{id:true}
    });
    
    if(!checkComment){
    throw new Error("Comment's the user not found!")
    }

    return await prisma.comment.update({
        where: {
            id,
            user_id
        },
        data
    })
}

const deleteComment = async(user_id:string,id:string) => {
    const checkComment = await prisma.comment.findFirst({
        where: {
            id,
            user_id
        },
        select:{id:true}
    });
    
    if(!checkComment){
    throw new Error("Comment's the user not found!")
    }

    return await prisma.comment.delete({
        where: {
            id,
            user_id
        },
    })
}


const getCommentsByAuthor = async(user_id:string) => {
    const commentData = await prisma.comment.findMany({
        where: {
            user_id,
        },
        include: {
            post:{
                select: {
                    id:true,
                    title: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return commentData;
};


const createComment = async (payload: { comment: string, post_id: string, user_id: string, comment_id?: string }) => {
    try {

        await prisma.post.findUniqueOrThrow({
            where: {
                id: payload.post_id
            }
        });

        if(payload.comment_id){
            await prisma.comment.findUniqueOrThrow({
                where: {
                    id:payload.comment_id
                }
            })
        }

        await prisma.post.findUniqueOrThrow({
            where: {
                id: payload.post_id
            }
        });

        return await prisma.comment.create({
            data: payload
        })
    } catch (error) {
        console.log(error)
    }
}



export const commentsService = {
    getCommentById,
    createComment,
    getCommentsByAuthor,
    deleteComment,
    updateComment,
}