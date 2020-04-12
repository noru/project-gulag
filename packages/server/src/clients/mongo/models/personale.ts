import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const Personale = new Schema({
  Id: String,
  IMSI: { type: String, default: '' },
  Name: { type: String, default: '' },
  NationalID: { type: String, default: '' },
  JobTitle: { type: String, default: '' },
  Department: { type: String, default: '' },
  IsExternal: { type: Boolean, default: false },
  Sex: { type: String, default: '' },
  Education: { type: String, default: '' },
  MaritalStatus: { type: String, default: '' },
  Phone: { type: String, default: '' },
  Address: { type: String, default: '' },
  Certificates: { type: Array, default: [] },
})
