import mongoose from 'mongoose'

const Schema = mongoose.Schema

const Point = new Schema({
  name: { type: String, required: true },
  index: { type: Number, required: true },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  altitude: { type: Number, required: true },
})

export const Fence = new Schema({
  name: { type: String, required: true },
  points: { type: [Point], default: [] },
})
