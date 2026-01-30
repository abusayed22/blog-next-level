import { commentStatus, Post, postStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../../lib/prisma";
import { RoleEnum } from "../../middleware/auth/authMiddleware";


const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>, userId: string) => {
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
                _count: {
                    select: { comments: true }
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
                    select: { comments: true }
                }
            }
        });
        return getPost;
    });
}


const getMyPosts = async (user_id: string) => {
    if (!user_id) {
        throw new Error("The user unauthenticat!")
    }

    await prisma.user.findUniqueOrThrow({
        where: {
            id: user_id,
            status: "ACTIVE"
        }
    });

    const result = await prisma.post.findMany({
        where: {
            user_id
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    });

    return result;
}

// user -nejer post update korbe, isFeatured updated korte parbe na
// admin -onner post update korbe, isFeatured updated korte parbe 
const updatePost = async (postId: string, data: Partial<Post>, user_id: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId,
        }
    });

    if (!isAdmin && (postData.user_id !== user_id)) {
        throw new Error("Not permited the post update!");
    };

    if (!isAdmin) {
        delete data.isFeatured
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data
    });

    return result;
}

// user nejer post delete korte parbe and admin je karo post delete korte parbe
const deletePost = async (postId: string, user_id: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId,
        },
        select: {
            id: true,
            user_id: true,
        }
    });

    if (!isAdmin && (postData.user_id !== user_id)) {
        throw new Error("Not permited for delete action!");
    };


    const result = await prisma.post.delete({
        where: {
            id: postId
        }
    });

    return result;
}




const getStats = async () => {

    const [total_Posts, total_publishedPosts, total_draftPosts, total_archivedPosts, total_comments,total_users,total_admin,total_user,totalViews] = await prisma.$transaction(async (tx) => await Promise.all([
        await tx.post.count(),
        await tx.post.count({ where: { status: postStatus.PUBLISHED } }),
        await tx.post.count({ where: { status: postStatus.DRAFT } }),
        await tx.post.count({ where: { status: postStatus.ARCHIVED } }),
        await tx.comment.count(),

        await tx.user.count(),
        await tx.user.count({where:{role: RoleEnum.ADMIN}}),
        await tx.user.count({where:{role: RoleEnum.USER}}),
        // await tx.post.aggregate({_sum:{viewCount:true}})
        await tx.post.aggregate({
                    _sum: { viewCount:true }
                })
    ]))


    return {
        total_Posts,
        total_publishedPosts,
        total_draftPosts,
        total_archivedPosts,
        total_comments,
        total_users,
        total_admin,
        total_user,
        totalViews: totalViews._sum.viewCount
    }
}


export const postService = { createPost, getAllPosts, getPostById, getMyPosts, updatePost, deletePost, getStats }