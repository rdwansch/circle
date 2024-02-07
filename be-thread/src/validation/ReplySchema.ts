import * as Joi from "joi";

export const postReplySchema = Joi.object({
  content: Joi.string().required(),
  image: Joi.string(),
});
