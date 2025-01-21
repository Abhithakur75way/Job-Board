import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from "bcrypt";



/**
 * Hashes a password using bcrypt with a salt factor of 12.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 */

const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};


export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'employer' | 'candidate';
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employer', 'candidate'], required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Hash the user's password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
      return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
