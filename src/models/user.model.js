import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { ResponseBody } from '@/utils';
import { HTTP_STATUS } from 'constants';

const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'minimum 3 characters required'],
      maxlength: [20, 'maximum 20 characters allow'],
    },
    fullName: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
    },
    avt: { type: String, base64: String },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    mobileNo: { type: String, required: true },
    googleId: { type: String },
    mail: { type: String },
  },
  { timestamps: true },
);

UserSchema.pre('validate', async function (next) {
  const { password } = this;
  const { status: bool, message } = passwordCompliance(password);
  if (!bool) {
    next(new ResponseBody(HTTP_STATUS.BAD_REQUEST, message));
  }
  this.password = await bcrypt.hash(password, 10);
  next();
});

function passwordCompliance(password) {
  const message = `password not compliant .<br>
  1.The length of passwords should be set to minimum 8 characters and maximum 40 characters, .<br>
  2. Each Password must contain characters from three of the following four sets of characters: <br>
  A) Upper Case letters <br>
  B) Lower Case letters <br>
  C) Numbers <br>
  D) Special Characters (non alphanumeric symbols)`;
  const regex =
    /(?=.{8,})((?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_])|(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])).*/;
  const status = new RegExp(regex).test(password);
  return { status, message };
}

UserSchema.statics.passwordCompliance = passwordCompliance;
UserSchema.index({ userId: 1 }, { unique: true });

const UserModel = mongoose.model('User', UserSchema);

export { UserModel };
