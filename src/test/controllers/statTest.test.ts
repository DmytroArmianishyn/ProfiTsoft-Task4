import chai from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import { mockReq, mockRes } from 'sinon-express-mock';
import { createGameStats, getGameStatsByPlayerId, getCounts } from 'src/controllers/gamestats/gameStatsController';
import GameStats from 'src/model/IGameStats';
import Player from 'src/model/player';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GameStatsController', () => {
  let sandbox: sinon.SinonSandbox;
  let req: any;
  let res: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = mockReq();
    res = mockRes();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create game stats', async () => {
    req.body = {
      playerId: 'playerId',
      points: 10,
      rebounds: 5,
      assists: 3,
    };

    sandbox.stub(Player, 'findById').resolves({});

    await createGameStats(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
  });

  it('should handle error if player not found', async () => {
    req.body = {
      playerId: 'playerId',
      points: 10,
      rebounds: 5,
      assists: 3,
    };

    sandbox.stub(Player, 'findById').resolves(null);

    await createGameStats(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
  });

  it('should get game stats by player ID', async () => {
    req.query = { playerId: 'playerId', size: '10', from: '0' };

    sandbox.stub(GameStats, 'find').resolves([]);

    await getGameStatsByPlayerId(req, res);

    expect(res.send.calledOnce).to.be.true;
  });

  it('should get counts of game stats by player IDs', async () => {
    req.body = { playerIds: ['playerId1', 'playerId2'] };

    sandbox.stub(GameStats, 'aggregate').resolves([{ _id: 'playerId1', count: 5 }, { _id: 'playerId2', count: 3 }]);

    await getCounts(req, res);

    expect(res.send.calledOnce).to.be.true;
  });

  it('should handle error while getting counts', async () => {
    req.body = { playerIds: ['playerId1', 'playerId2'] };

    sandbox.stub(GameStats, 'aggregate').throws(new Error('Database error'));

    await getCounts(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.send.calledOnce).to.be.true;
  });
});
