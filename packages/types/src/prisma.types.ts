interface ReturnPrismaResponse<T> {
  status: "success" | "error";
  status_code: number;
  message: string;
  payload: T | null;
}

export type { ReturnPrismaResponse };
