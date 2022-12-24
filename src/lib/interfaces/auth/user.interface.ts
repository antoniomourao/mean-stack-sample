import { mongoModel } from "./mongo-model.interface";

export interface user extends mongoModel {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  token: string;
}

export const userSchema: Record<string, any> = {
  userName: { type: String, default: null, unique: true },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String, default: null },
  token: { type: String, default: null },
};
