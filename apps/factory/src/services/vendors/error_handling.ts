export interface LlmErrorResponse {
  code: number;
  message: string | null;
  vendorCode: number | null;
  vendorMessage: string | null;
}
export interface ErrorCodeDetails {
  message: string;
  type: string;
}

export const errorCodes: Record<string, ErrorCodeDetails> = {
  400: { message: "Bad Request", type: "400/BAD_REQUEST" },
  401: { message: "Unauthorized", type: "401/UNAUTHORIZED" },
  403: { message: "Forbidden", type: "403/FORBIDDEN" },
  404: { message: "Not Found", type: "404/NOT_FOUND" },
  500: {
    message: "Internal Server Error",
    type: "server/500_INTERNAL_SERVER_ERROR",
  },
  501: { message: "Not Implemented", type: "server/501_NOT_IMPLEMENTED" },
  502: { message: "Bad Gateway", type: "server/502_BAD_GATEWAY" },
};
