import { createErrorResponse } from "@world-you-past/shared/response";

export function createErrorProvider(msg: string) {
    return {
        error: createErrorResponse(-2, msg) as any,
    };
}
