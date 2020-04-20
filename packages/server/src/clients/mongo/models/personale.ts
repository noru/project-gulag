import mongoose, { Schema, Document, Model } from 'mongoose'

export interface Certificate {
  id: string
  name: string
  validUntil: Date
}

export interface IPersonale extends Document {
  id: string
  imei: string
  name: string
  nationalId: string
  jobTitle: string
  department: string
  isExternal: string
  sex: string
  education: string
  maritalStatus: string
  phone: string
  address: string
  vehicleId: string
  vehicleTerminalId: string
  certificates: Certificate[]
}

export const PersonaleSchema = new Schema({
  id: { type: String, required: true, index: { unique: true } },
  imei: { type: String, index: { unique: true, sparse: true }, minlength: 15, maxlength: 15 },
  name: { type: String, required: true, index: { unique: true }, minlength: 1 },
  nationalId: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  department: { type: String, default: '' },
  isExternal: { type: Boolean, default: false },
  sex: { type: String, default: '' },
  education: { type: String, default: '' },
  maritalStatus: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  vehicleId: { type: String, default: '' },
  vehicleTerminalId: { type: String, default: '' },
  certificates: { type: Array, default: [] },
})

interface IPersonaleModel extends Model<IPersonale> {
  findByIMEI(imei: string): Promise<IPersonale | null>
}

PersonaleSchema.statics.findByIMEI = async function (this: Model<IPersonale>, imei: string) {
  return await this.findOne({ imei })
}

export default mongoose.model<IPersonale, IPersonaleModel>('Personale', PersonaleSchema)
