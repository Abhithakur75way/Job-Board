import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'employer' | 'candidate';
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employer', 'candidate'], required: true },
});

export const User = mongoose.model<IUser>('User', UserSchema);
