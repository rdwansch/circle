import * as Joi from "joi";

export const postThreadSchema = Joi.object({
  content: Joi.string().required(),
  image: Joi.string(),
});
