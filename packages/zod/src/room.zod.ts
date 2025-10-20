import { z } from "zod";

// /x(?!y)/ matches "x" if "x" is NOT followed by "y".
const create_room_zod_schema = z.object({
  slug: z.string().regex(
    /^(?!-)(?!.*--)[a-z0-9-]{3,64}(?<!-)$/,
    "Invalid room-name format: use 3-64 lowercase letters, numbers, or hyphens. No leading, trailing, or consecutive hyphens allowed."
  ),
});

export { create_room_zod_schema };
