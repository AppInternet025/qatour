import mongoose from 'mongoose';

const puntuacionSchema = new mongoose.Schema({
  user_id:  { type: String, required: true },
  location_id: { type: String, required: true },
  score: { type: Number, min: 1, max: 5, required: true }
}, { timestamps: true });

puntuacionSchema.index({ user: 1, location: 1 }, { unique: true }); 

export default mongoose.models.Puntuacion || mongoose.model('Puntuacion', puntuacionSchema);
