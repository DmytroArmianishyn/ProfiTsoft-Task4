import log4js from 'log4js';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import GameStats from 'src/model/IGameStats';
import Player from 'src/model/player';
import { GameStatsSaveDto } from 'src/dto/gamestat/GameStatsSaveDto';
import { InternalError } from 'src/system/internalError';

const logger = log4js.getLogger();

export const createGameStats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      playerId,
      points,
      rebounds,
      assists,
    } = new GameStatsSaveDto(req.body);


    const player = await Player.findById(playerId);
    if (!player) {
      logger.error('Player not found', { playerId });
      return res.status(httpStatus.NOT_FOUND).send({ message: 'Player not found' });
    }

    const gameStats = new GameStats({ playerId, points, rebounds, assists });
    const savedGameStats = await gameStats.save();
    return res.status(httpStatus.CREATED).send(savedGameStats);
  } catch (err) {
    const { message, status } = new InternalError(err);
    logger.error('Error in creating game stats.', err);
    return res.status(status).send({ message });
  }
};

export const getGameStatsByPlayerId = async (req: Request, res: Response): Promise<Response> => {
  const { playerId } = req.query;
  const size = parseInt(req.query.size as string) || 10;
  const from = parseInt(req.query.from as string) || 0;

  try {
    const stats = await GameStats.find({ playerId })
      .sort({ date: -1 })
      .skip(from)
      .limit(size);
    return res.send(stats);
  } catch (err) {
    const { message, status } = new InternalError(err);
    logger.error('Error in retrieving game stats.', err);
    return res.status(status).send({ message });
  }
};

export const getCounts = async (req: Request, res: Response): Promise<Response> => {
  const { playerIds } = req.body;

  try {
    const counts = await GameStats.aggregate([
      { $match: { playerId: { $in: playerIds } } },
      { $group: { _id: '$playerId', count: { $sum: 1 } } },
    ]);

    const result = playerIds.reduce((acc: any, id: string) => {
      const count = counts.find((c: any) => c._id === id)?.count || 0;
      acc[id] = count;
      return acc;
    }, {});

    return res.send(result);
  } catch (err) {
    const { message, status } = new InternalError(err);
    logger.error('Error in retrieving game stats counts.', err);
    return res.status(status).send({ message });
  }
};