import mongoose from 'mongoose'

const Schema = mongoose.Schema

export enum Role {
  Viewer = 'viewer',
  Admin = 'admin',
}

export const User = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  salt: { type: String, required: true },
  hashedPwd: { type: String, required: true },
  role: { type: String, default: Role.Viewer },
  displayName: { type: String, default: '' },
})

mongoose.model('User', User)
