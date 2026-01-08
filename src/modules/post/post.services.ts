import { commentStatus, Post, postStatus } from "../../../generated/prisma/client";
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
const getAllPosts = async ({ search, tags, isFeatured, status, user_id, page, limit, skip, order, orderBy }: { search: string, tags: string[], isFeatured: boolean | undefined, status: postStatus | undefined, user_id: string | undefined, page: number, limit: number, skip: number, orderBy: string, order: string }) => {

    const andCondtions: PostWhereInput[] = [];

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

    if (typeof isFeatured === 'boolean') {
        andCondtions.push({ isFeatured })
    }

    // if(status === 'PUBLISHED' || status === 'DRAFT' || status === 'ARCHIVED'){ TODO: improve this check
    if (status) {
        andCondtions.push({ status })
    }

    if (user_id) {
        andCondtions.push({ user_id })
    }

    const result = await prisma.post.findMany(
        {
            take: limit,
            skip,
            where: {
                // search with containts in title or content or tags
                // search && or 
                AND: andCondtions
            },
            orderBy: orderBy ? {
                [orderBy]: order ?? 'asc'
            } : {
                createdAt: 'desc'
            },
            include: {
                _count:{
                    select:{comments:true}
                }
            }
        }
    );

    const total = await prisma.post.count({
        where: {
            AND: andCondtions
        }
    });

    return {
        data: result,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}


const getPostById = async (postId: string) => {
    return await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                viewCount: {
                    increment: 1
                }
            }
        });
        const getPost = await tx.post.findUnique({
            where: {
                id: postId
            },
            include: {
                comments: {
                    where: {
                        parent_id: null,
                        status: commentStatus.APPROVED
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        replies: {
                            where: {
                                status: commentStatus.APPROVED
                            },
                            orderBy: {
                                createdAt: 'asc'
                            },
                            include: {
                                replies: {
                                    where: {
                                        status: commentStatus.APPROVED
                                    },
                                    orderBy: {
                                        createdAt: 'asc'
                                    },
                                }
                            }
                        }
                    }
                },
                _count: {
                    select:{comments:true}
                }
            }
        });
        return getPost;
    });
}



export const postService = { createPost, getAllPosts, getPostById }