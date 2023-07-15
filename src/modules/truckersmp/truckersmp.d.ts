interface TruckersMPGameTime {
  error: boolean;
  game_time: number;
}

interface TruckersMPServer {
  response: {
    id: number;
    game: string;
    ip: string;
    port: number;
    name: string;
    shortname: string;
    idprefix: string;
    online: boolean;
    players: number;
    queue: number;
    maxplayers: number;
    mapid: number;
    displayorder: number;
    speedlimiter: number;
    collisions: boolean;
    carsforplayers: boolean;
    policecarsforplayers: boolean;
    afkenabled: boolean;
    event: boolean;
    specialEvent: boolean;
    promods: boolean;
    syncdelay: number;
  }[],
  error: boolean
}