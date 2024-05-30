import { Schema, model, Document } from 'mongoose';

interface player extends Document {
  name: string;
  position: string;
  teamId: string;
}

const PlayerSchema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  teamId: { type: String, required: true },
});

export default model<player>('Player', PlayerSchema);
