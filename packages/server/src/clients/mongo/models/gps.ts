import mongoose, { Schema, Document } from 'mongoose'
import { LocationMessage } from '#/models/location'

export interface IGPSLog extends Document {
  timestamp: number
  imei: string
  data: LocationMessage
}

export const MetadataSchema: Schema = new Schema({
  timestamp: { type: Number, required: true, index: true },
  imei: { type: String, required: true, index: true },
  data: { type: Schema.Types.Mixed },
})

export default mongoose.model<IGPSLog>('GPSLog', MetadataSchema)
