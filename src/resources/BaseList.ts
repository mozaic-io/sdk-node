export interface IApiList<T> {
    'count'?: number | undefined;
    'page'?: number | null | undefined;
    'total_count'?: number | undefined;
}

export abstract class BaseList<T> {
    /**
     * 
     * @type {Array<T>}
     * memberof ListBase
     */
    'data': Array<T>;
    /**
     * This is the count of records returned
     * @type {number}
     * memberof ListBase
     */
    'count': number;
    /**
     * The page this list represents
     * @type {number}
     * memberof ListBase
     */
    'page': number;
    /**
     * This is the total count of records available, Needed for pagination
     * @type {number}
     * memberof ListBase
     */
    'totalCount': number;

    /**
     * Converts a paged data response from the API into an SDK friendly format.
     * @param source The API response that contains paging information about the list
     * @param data The actual list items returned from the API.
     */
    constructor(source: IApiList<T>, data: T[] | undefined)  {
        if(data === undefined)
            throw new Error("Data element was undefined, unable to copy the data from the API to the list. Check the map function on the API result handler.")
        
        this.data = data;
        this.count = source.count ?? 0;
        this.page = source.page ?? 0;
        this.totalCount = source.total_count ?? 0;
    }
}