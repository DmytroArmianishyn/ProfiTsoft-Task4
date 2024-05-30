import { Router } from 'express';
import {
  createGameStats, getGameStatsByPlayerId, getCounts ,
} from 'src/controllers/gamestats/gameStatsController';

const router = Router();

router.post('/gamestats', createGameStats);
router.get('/gamestats', getGameStatsByPlayerId);
router.post('/gamestats/_counts', getCounts);

export default router;