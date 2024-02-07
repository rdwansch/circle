import * as Joi from "joi";

export const registerUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
  full_name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  // profile_picture: Joi.string().required(),
  // profile_description: Joi.string().required(),
  // profile_picture
});

export const loginUserSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().required(),
});

export const editProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  password: Joi.string(),
  full_name: Joi.string().min(3),
  email: Joi.string().email(),
  profile_picture: Joi.any(),
  profile_description: Joi.any(),
});
