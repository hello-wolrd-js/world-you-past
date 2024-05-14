export interface SuccessResponse<T> {
    code: number;
    msg: string;
    data: T;
}

export interface ErrorResponse {
    code: number;
    error: string;
}
