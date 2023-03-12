import Joi from '@hapi/joi';

const gender = ['male', 'female', 'transgender'];

const UserSchema = Joi.object().keys({
  fullName: {
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
  },
  gender: Joi.string()
    .trim()
    .required()
    .valid(...gender),
  userId: Joi.string().trim().required().min(3).max(20),
  mobileNo: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
  password: Joi.string().trim().required(),
  mail: Joi.mail(),
  googleId: Joi.string().trim(),
});

export { UserSchema };
