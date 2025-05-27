import mongoose from 'mongoose';

const FotoSchema = new mongoose.Schema({
  idComentario: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  urlCloudinary: {
    type: String,
    required: true
  }
});

export default mongoose.models.Foto || mongoose.model('Foto', FotoSchema);