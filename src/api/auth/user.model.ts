import mongoose from "mongoose";
import { userSchema } from '../../lib/interfaces';

const USER_COLLECTION_NAME = "user";

const UserSchema = new mongoose.Schema(userSchema);

export const UserModel = () => mongoose.model(USER_COLLECTION_NAME, UserSchema);