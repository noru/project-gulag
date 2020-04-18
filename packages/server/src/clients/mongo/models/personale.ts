import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPersonale extends Document {
  id: string
  IMEI: string
  name: string
  nationalID: string
  jobTitle: string
  department: string
  isExternal: string
  sex: string
  education: string
  maritalStatus: string
  phone: string
  address: string
  certificates: any[]
}

export const PersonaleSchema = new Schema({
  id: { type: String, required: true, index: { unique: true } },
  IMEI: { type: String, index: { unique: true }, minlength: 15, maxlength: 15 },
  name: { type: String, required: true, minlength: 1 },
  nationalID: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  department: { type: String, default: '' },
  isExternal: { type: Boolean, default: false },
  sex: { type: String, default: '' },
  education: { type: String, default: '' },
  maritalStatus: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  certificates: { type: Array, default: [] },
})

interface IPersonaleModel extends Model<IPersonale> {
  findByIMEI(imei: string): Promise<IPersonale | null>
}

PersonaleSchema.statics.findByIMEI = async function (this: Model<IPersonale>, IMEI: string) {
  return await this.findOne({ IMEI })
}

export default mongoose.model<IPersonale, IPersonaleModel>('Personale', PersonaleSchema)
