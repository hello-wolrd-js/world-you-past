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
export function createErrorResponse(
    code: number,
    error: string
): ErrorResponse {
    return {
        code,
        error,
    };
}
