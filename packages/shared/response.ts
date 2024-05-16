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

export function isSuccessResponse<T>(
    response: SuccessResponse<T> | ErrorResponse
): response is SuccessResponse<T> {
    return response.code >= 0;
}

export function isErrorResponse<T>(
    response: SuccessResponse<T> | ErrorResponse
): response is ErrorResponse {
    return !isSuccessResponse(response);
}
