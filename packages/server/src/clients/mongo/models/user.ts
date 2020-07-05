import mongoose, { Schema, Document, Model } from 'mongoose'
import { SHA256 } from 'sha2'
import _ from 'lodash'

export enum Role {
  Viewer = 'viewer',
  Admin = 'admin',
}

export interface IUserBasic {
  username: string
  email: string
  role: Role
  displayName: string
}

export interface IUserExtra {
  salt: string
  hashMethod: 'SHA256'
  hashedPwd: string
}

export interface IUser extends Document, IUserBasic, IUserExtra { }

export interface IUserSchema {
  validate(user: string, password: string): IUserBasic | null
}

export const UserSchema = new Schema<IUserSchema>({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  salt: { type: String, required: true },
  hashMethod: { type: String, default: 'SHA256' },
  hashedPwd: { type: String, required: true },
  role: { type: String, default: Role.Viewer },
  displayName: { type: String, default: '' },
})

interface IUserModel extends Model<IUser> {
  authenticate(user: string, password: string): Promise<IUserBasic | null>
  createUser(user: string, password: string, rest?: object): Promise<null>
  allUsers(): Promise<IUserBasic[]>
}

UserSchema.statics.authenticate = async function (this: Model<IUser>, user, password) {
  let userData = await this.findOne().or([{ username: user }, { email: user }])
  if (userData?.hashedPwd === SHA256(password + userData?.salt).toString('hex')) {
    return omitSensitive(userData!)
  }
  return null
}

UserSchema.statics.allUsers = async function (this: Model<IUser>) {
  let users = await this.find()
  return users.map(omitSensitive)
}

UserSchema.statics.createUser = async function (this: Model<IUser>, username, password, rest = {}) {
  let salt = SHA256('' + Math.random()).toString('hex')
  let hashedPwd = SHA256(password + salt).toString('hex')
  this.create({
    username,
    salt,
    hashedPwd,
    ...rest,
  } as any)
  return null
}

export function omitSensitive(user: IUser): IUserBasic {
  return _.omit(user.toJSON ? user.toJSON() : user, ['_id', '__v', 'salt', 'hashedPwd', 'hashMethod'])
}

export default mongoose.model<IUser, IUserModel>('User', UserSchema)
