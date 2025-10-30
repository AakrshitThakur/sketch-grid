interface ReturnPrismaResponse<T> {
  status: "success" | "error";
  status_code: number;
  message: string;
  payload: T | null;
}

interface RoomTable {
  id: number;
  slug: string;
  createdAt: Date;
  admin_id: string;
}

export type { ReturnPrismaResponse, RoomTable };
