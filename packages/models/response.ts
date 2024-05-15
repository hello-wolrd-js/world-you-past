export interface SuccessResponse<T> {
    code: number;
    msg: string;
    data: T;
}

export interface ErrorResponse<U> {
    code: number;
    error: U;
}
