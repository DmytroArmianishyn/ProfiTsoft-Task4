export class GameStatsSaveDto {
  public playerId: string;
  public points: number;
  public rebounds: number;
  public assists: number;

  constructor(data: any) {
    this.playerId = data.playerId;
    this.points = data.points;
    this.rebounds = data.rebounds;
    this.assists = data.assists;
  }
}
