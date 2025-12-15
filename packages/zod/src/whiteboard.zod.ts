import { z } from "zod";

/* ---------- Basic Schemas ---------- */

const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const BaseShapeSchema = z.object({
  id: z.string(),
});

/* ---------- Shape Schemas ---------- */

const CircleShapeSchema = BaseShapeSchema.extend({
  type: z.literal("circle"),
  center: PointSchema,
  radius: z.number(),
});

const BoxShapeSchema = BaseShapeSchema.extend({
  type: z.literal("box"),
  point: PointSchema,
  width: z.number(),
  height: z.number(),
});

const ArrowShapeSchema = BaseShapeSchema.extend({
  type: z.literal("arrow"),
  points: z.object({
    start: PointSchema,
    end: PointSchema,
  }),
});

const TextShapeSchema = BaseShapeSchema.extend({
  type: z.literal("text"),
  text: z.string(),
  font: z.object({
    font_size: z.number(),
  }),
  points: z.object({
    start: PointSchema,
    end: PointSchema,
  }),
});

export const DiamondShapeSchema = BaseShapeSchema.extend({
  type: z.literal("diamond"),
  center: PointSchema,
  width: z.number(),
  height: z.number(),
});

/* ---------- Discriminated Union ---------- */
// A discriminated union is a special kind of union in which a) all the options are object schemas that b) share a particular key (the "discriminator")
const ShapeSchema = z.discriminatedUnion("type", [
  CircleShapeSchema,
  BoxShapeSchema,
  ArrowShapeSchema,
  TextShapeSchema,
  DiamondShapeSchema,
]);

const ShapesSchema = z.array(ShapeSchema);

/* ---------- WebSocket Enums ---------- */

const WsTypeSchema = z.enum([
  "join-room",
  "leave-room",
  "create-shape",
  "get-all-shapes",
  "alter-shape",
  "delete-shape",
  "delete-all-shapes",
  "auth",
  "others",
]);

const WsStatusSchema = z.enum(["success", "error", "info", "warn"]);

// zod-schema for web-socket response object
// Union types (A | B) represent a logical "OR". Zod union schemas will check the input against each option in order. The first value that validates successfully is returned.
const WsResponseSchema = z.object({
  type: WsTypeSchema,
  status: WsStatusSchema,
  message: z.string(),
  payload: z.union([ShapeSchema, ShapesSchema]).nullable(),
});

/* ---------- Inferred Types ---------- */
export type Point = z.infer<typeof PointSchema>;
export type BaseShape = z.infer<typeof BaseShapeSchema>;
export type Shape = z.infer<typeof ShapeSchema>;
export type Shapes = z.infer<typeof ShapesSchema>;
export type WsType = z.infer<typeof WsTypeSchema>;
export type WsStatus = z.infer<typeof WsStatusSchema>;
export type WsResponse = z.infer<typeof WsResponseSchema>;
