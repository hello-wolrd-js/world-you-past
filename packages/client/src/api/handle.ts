import { ErrorResponse, SuccessResponse } from "@world-you-past/models";
import { createErrorResponse } from "@world-you-past/shared/response";
import { isAxiosError, type AxiosError, type AxiosResponse } from "axios";

export async function handleRequest<T>(
    request:
        | Promise<AxiosResponse<SuccessResponse<T>>>
        | (() => Promise<AxiosResponse<SuccessResponse<T>>>),
    options: {
        onSuccess?: (data: SuccessResponse<T>) => void;
        onError?: (error: AxiosError<unknown>) => void;
        onFinal?: () => void;
    } = {}
): Promise<SuccessResponse<T> | ErrorResponse> {
    try {
        const response = await (typeof request === "function"
            ? request()
            : request);
        options.onSuccess?.(response.data);
        return response.data;
    } catch (error) {
        if (isAxiosError<ErrorResponse>(error)) {
            options.onError?.(error);
            if (error.response) {
                return error.response.data;
            } else {
                return createErrorResponse(-2, "网络错误!");
            }
        } else {
            return createErrorResponse(-3, "未知错误: " + error);
        }
    } finally {
        options.onFinal?.();
    }
}
