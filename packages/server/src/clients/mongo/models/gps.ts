import mongoose, { Schema, Document, Model } from 'mongoose'
import { LocationMessage } from '#/models/location'

export interface IGPSLog extends Document {
  timestamp: number
  imei: string
  data: LocationMessage
}

export const GPSLogSchema: Schema = new Schema({
  timestamp: { type: Number, required: true, index: true },
  imei: { type: String, required: true, index: true },
  data: { type: Schema.Types.Mixed },
})


interface IGPSLogModel extends Model<IGPSLog> {
  findByIMEI(imei: string, from: number, to: number): Promise<IGPSLog[]>
}

GPSLogSchema.statics.findByIMEI = async function (this: Model<IGPSLog>, imei: string, from: number, to: number) {
  return await this.find({ imei, timestamp: { $gt: from, $lt: to } }).sort({ timestamp: -1 })
}


export default mongoose.model<IGPSLog, IGPSLogModel>('GPSLog', GPSLogSchema)
