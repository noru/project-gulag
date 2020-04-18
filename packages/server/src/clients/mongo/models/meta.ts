import mongoose, { Schema, Document } from 'mongoose'

interface IMetadata extends Document {
  name: string
  description: string
  data: any
}

export const MetadataSchema: Schema = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  description: { type: String, default: '' },
  data: { type: Schema.Types.Mixed },
})

export default mongoose.model<IMetadata>('Metadata', MetadataSchema)
