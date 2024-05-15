import { SuccessResponse, ErrorResponse } from "@world-you-past/models";

export function createSuccessResponse<T>(
    code: number,
    msg: string,
    data: T
): SuccessResponse<T> {
    return {
        code,
        msg,
        data,
    };
}
export function createErrorResponse<U = string>(
    code: number,
    error: U
): ErrorResponse<U> {
    return {
        code,
        error,
    };
}
