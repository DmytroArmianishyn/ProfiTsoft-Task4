import { Schema, model, Document } from 'mongoose';

interface IGameStats extends Document {
  playerId: string;
  teamId: string;
  date: Date;
  points: number;
  rebounds: number;
  assists: number;

}

const GameStatsSchema = new Schema({
  playerId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  points: { type: Number, required: true },
  rebounds: { type: Number, required: true },
  assists: { type: Number, required: true },

});

export default model<IGameStats>('GameStats', GameStatsSchema);
