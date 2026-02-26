import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const objectIdParamSchema = z.object({
  paramas: z.object({
    id: z.string().refine((val) => isValidObjectId(val), {
      message: "Invalid ObjectId",
    }),
  }),
});
