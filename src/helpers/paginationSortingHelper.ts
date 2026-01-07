
type IOptions = {
    page?: number|string;
    limit?: number|string;
    orderBy?: string;
    order?: 'asc'| 'desc';
}

type OptionReturn = {
    page:number;
    limit:number;
    skip: number;
    orderBy: string;
    order: 'asc'|'desc';

}

const paginationSortingHelper = (options:IOptions):OptionReturn => {
    const page =  Number(options.page) ||1;
    const limit = Number(options.limit)||5;
    const skip = (page -1) * limit;

    const orderBy = options.orderBy?options.orderBy: 'createdAt';
    const order = options.order? options.order:'desc';

    return {page,limit,skip,orderBy,order}
};


export default paginationSortingHelper;