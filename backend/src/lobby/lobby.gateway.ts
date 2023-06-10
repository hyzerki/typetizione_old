import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "Socket.IO";
import { LobbyService } from './lobby.service';
import { PlayerService } from 'src/player/player.service';

const GAME_MAX_PLAYERS = 5;

interface Player {
  player_id: string;
  username: string;
}

interface Lobby {
  id: string;
  players: Array<Player>;
}

class Seeker implements Lobby {
  id: string;
  players: Player[];
  gameType: string[];
  upperBound: number;
  lowerBound: number;
  boundUpdateInterval?: NodeJS.Timer = setInterval(() => {
    this.lowerBound -= 100;
    this.upperBound += 100;
    //todo зачекать остальные лобби вдруг уже совпадает
  });

}

function countPlayers(arr: Seeker[]) {
  return arr.map(element => element.players.length).reduce((a, b) => a + b);
}

//Хранит список лобби
//todo перенести хранение лобби в redis
const lobbies: Map<string, Lobby> = new Map();
const searchQueue: Seeker[] = new Array<Seeker>();
@WebSocketGateway({
  cors: { origin: "*" },
  serveClient: false,
  namespace: "lobby",
})
export default class LobbyGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private lobbyService: LobbyService, private playerService: PlayerService) { }

  @WebSocketServer()
  server: Server;



  afterInit(server: Server) {

  }


  /**
   * Принимает сообщение с айди пользователя и отправляет ему айди отправителя, чтобы тот мог ответить 
   * @param client тот, кто пригглагает к себе в лоббак
   * @param payload  айди того, кого надо позвать в лоббак
   */
  @SubscribeMessage("invite")
  handleInvite(client: Socket, payload: any) {
    const player_id = client.data.player_id as string;
    this.server.to(payload).emit("invite", player_id);
  }

  /**
   * Отвечает за принятие приглашения в лобби, пользователь, который хочет принять приглашение отправляет айди пользователя в лобби которого хочет присоединиться
   * @param client Клиент, который принял приглашение в лобби
   * @param payload  Идентификатор пользователя, в лобби которому надо подключиться
   */
  @SubscribeMessage("join_lobby")
  handleJoinLobby(client: Socket, payload: any) {
    const player_id = client.data.player_id as string;
    const username = client.data.username as string;
    const currentLobbyId = client.data.lobby_id as string;
    const newLobby = [...lobbies.values()].find(entry => entry.players.some(player => player.player_id == payload));
    console.log("payload", payload)
    const currentLobby = lobbies.get(currentLobbyId);


    console.log("currentLobby ", currentLobby);
    console.log("newLobby", newLobby);
    if (currentLobby.id === newLobby.id) {
      return;
    }

    if (currentLobby.players.length <= 1) {
      lobbies.delete(currentLobbyId);
    } else {
      currentLobby.players = currentLobby.players.filter(p => p.player_id != player_id);
      this.server.to(currentLobby.id).emit("lobby_changed", lobbies.get(currentLobby.id));
      this.server.to(currentLobby.id).emit("log", `Игрок ${username} покинул группу.`)
    }
    client.leave(currentLobbyId);

    client.data.lobby_id = newLobby.id;
    lobbies.get(newLobby.id).players.push({ player_id, username });
    client.join(newLobby.id);
    this.server.to(newLobby.id).emit("lobby_changed", lobbies.get(newLobby.id));
    this.server.to(newLobby.id).emit("log", `Игрок ${username} присоединился к группе.`)
  }

  /**
   * При подключении в хендшейк передаётся айди и имя игрока сохраняется информация о лобби, в котором находится игрок, а также игрок добавляется в комнату со своим айди переданным в хендшейке. В хендшейк записывается айди лобби, чтобы было удобнее его находить
   * @param client В хендшейке хранит {player_id: string, username: string}
   * @param args 
   */
  handleConnection(client: Socket, ...args: any[]) {
    console.log("New client!");
    const player_id = client.handshake.query.player_id as string;
    const username = client.handshake.query.username as string;
    console.log(client.handshake.query);
    client.data.player_id = player_id;
    client.data.username = username;
    client.data.lobby_id = client.id;
    lobbies.set(client.id, { id: client.id, players: [{ player_id, username }] });
    client.join(player_id);
    this.server.to(client.id).emit("lobby_changed", lobbies.get(client.id));
    console.log(client.rooms)
  }



  /**
   * При отключении игрок удаляется из лобби и если лобби остаётся пустым мы лобби удаляем.
   * Если лобби ещё существует мы отправляем сообщение о том, что пользователь покинул группу.
   * @param client 
   * @returns 
   */
  handleDisconnect(client: Socket) {
    const player_id = client.data.player_id as string;
    const username = client.data.username as string;
    const lobby_id = client.data.lobby_id as string;
    const lobby = lobbies.get(lobby_id);
    if (lobby.players.length <= 1) {
      lobbies.delete(lobby_id);
      return;
    }
    lobby.players = lobby.players.filter(p => p.player_id != player_id);
    this.server.to(lobby_id).emit("lobby_changed", lobbies.get(lobby_id));
    this.server.to(lobby_id).emit("log", `Игрок ${username} покинул группу (Disconnect).`);
  }

  /**
   * Принимает сообщение и ретранслирует его всем в лобби добавляя к нему данные о пользователе отправившем его для вывода типа "[username]: [payload]"
   * @param client Отправивший сообщение
   * @param payload Текст сообщения
   */
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    console.log(client.data);
    console.log("message: ", payload);
    this.server.to(client.data.lobby_id).emit("message", { data: client.data, text: payload });
    console.log("sent");
  }

  @SubscribeMessage("leave_lobby")
  handleLeaveLobby(client: Socket, payload: any) {

    // uuid.v4();
    const player_id = client.data.player_id as string;
    const username = client.data.username as string;
    const currentLobbyId = client.data.lobby_id as string;
    const newLobbyId = this.lobbyService.generateNewLobbyUUID();
    const currentLobby = lobbies.get(currentLobbyId);


    if (currentLobby.players.length <= 1) {
      lobbies.delete(currentLobbyId);
    } else {
      currentLobby.players = currentLobby.players.filter(p => p.player_id != player_id);
      this.server.to(currentLobby.id).emit("lobby_changed", lobbies.get(currentLobby.id));
      this.server.to(currentLobby.id).emit("log", `Игрок ${username} покинул группу.`)
    }
    client.leave(currentLobbyId);
    lobbies.set(newLobbyId, { id: newLobbyId, players: [{ player_id, username }] });
    console.log("Новое лобби: ", lobbies.get(newLobbyId));


    client.data.lobby_id = newLobbyId;
    client.join(newLobbyId);

    this.server.to(newLobbyId).emit("lobby_changed", lobbies.get(newLobbyId));
    this.server.to(newLobbyId).emit("log", `Игрок ${username} присоединился к группе.`)
  }


  //<==================================================================================================================>

  /**
   * Начинает поиск, создаёт объект в котором хранится как и в лобби список игроков и нижняя и верхняя граница поиска.
   * Граница: самый большой рейтинг в группе +150 и самый маленьгий -150.
   * Границы рейтинга расширяются каждые 10сек по +100 и -100 и во время расширения снова проверяются все игроки в поиске, для нахождения подходящего вод границы.
   * Так же при подключении игрока в поиск проверяется, подходит ли он по рейтингу к уже существующим группам, ведущим поиск
   * @param client игрок, нажавший кнопку поиска
   * @param payload передаются параметры поиска {type: [ranked, casual], }
   */
  @SubscribeMessage("start_queue")
  async handleStartRankedSearch(client: Socket, payload: any) {
    const gameType = payload.gameType;
    const lobby = lobbies.get(client.data.lobby_id);
    const players = await this.playerService.findMany(lobby.players.map(p => { id: p.player_id }));
    const lowerBound = Math.min.apply(Math, players.map(p => p.rating)) - 150;
    const upperBound = Math.max.apply(Math, players.map(p => p.rating)) + 150;
    searchQueue.push({ ...lobby, lowerBound, upperBound, gameType })
    this.server.to(lobby.id).emit("start_queue");

    //todo если игроков в группе такое колличество или больше того, что требуется для начала игры - сразу создавать им игру без помещения в очередь
    if (lobby.players.length >= GAME_MAX_PLAYERS) {

    }


    //Логика подбора игроков 
    //todo: вынести в отдельную функцию
    searchQueue.forEach((seeker1: Seeker) => {
      let suitableSeekers = searchQueue.filter(seeker2 =>
        seeker1.id !== seeker2.id
        &&
        seeker1.players.length + seeker2.players.length <= GAME_MAX_PLAYERS
        &&
        seeker1.lowerBound <= seeker2.lowerBound
        &&
        seeker1.upperBound >= seeker2.upperBound
        &&
        //смотрим совпадает ли хотябы один режим игры
        seeker1.gameType.some(t1 => seeker2.gameType.includes(t1))
      );

      //теперь надо из того, что нашло собрать нам фул игру
      /*
        два цикла i и j для каждого iтого ищем несколько jтых чтобы 

      */

      let readyCombinations: Seeker[] = [];

      for (let i = 0; i < suitableSeekers.length; i++) {
        let comb: Seeker[] = [];
        //todo возможно это лишнее
        comb.push(seeker1, suitableSeekers[i]);
        if (countPlayers(comb) === GAME_MAX_PLAYERS) {
          readyCombinations = comb;
          break; //fix или break
        }

        //comb.map(element => element.players.length).reduce((a, b) => a+b)
        //далее надо проверить может ли ещё 
        //как я заебался..
        let potentialComb = [...comb];
        for (let j = i + 1; j < suitableSeekers.length; j++) {
          if (countPlayers(potentialComb) + suitableSeekers[j].players.length > GAME_MAX_PLAYERS) {
            continue;
          }
          //добавляем в массив для последующих итераций
          potentialComb.push(suitableSeekers[j]);
          //если игра укомплектована
          if (countPlayers(potentialComb) === GAME_MAX_PLAYERS) {
            readyCombinations = potentialComb;
            break;
          }
        }
        if (readyCombinations.length !== 0) {
          break;
        }
      }
    })
  }

  findMatch(seeker: Seeker) {
    let suitableSeekers = searchQueue.filter(seeker2 =>
      seeker.id !== seeker2.id
      &&
      seeker.players.length + seeker2.players.length <= GAME_MAX_PLAYERS
      &&
      seeker.lowerBound <= seeker2.lowerBound
      &&
      seeker.upperBound >= seeker2.upperBound
      &&
      //смотрим совпадает ли хотябы один режим игры
      seeker.gameType.some(t1 => seeker2.gameType.includes(t1))
    );

    //теперь надо из того, что нашло собрать нам фул игру
    /*
      два цикла i и j для каждого iтого ищем несколько jтых чтобы 

    */

    let readyCombinations: Seeker[] = [];

    for (let i = 0; i < suitableSeekers.length; i++) {
      let comb: Seeker[] = [];
      //todo возможно это лишнее
      comb.push(seeker, suitableSeekers[i]);
      if (countPlayers(comb) === GAME_MAX_PLAYERS) {
        readyCombinations = comb;
        break; //fix или break
      }

      //comb.map(element => element.players.length).reduce((a, b) => a+b)
      //далее надо проверить может ли ещё 
      //как я заебался..
      let potentialComb = [...comb];
      for (let j = i + 1; j < suitableSeekers.length; j++) {
        if (countPlayers(potentialComb) + suitableSeekers[j].players.length > GAME_MAX_PLAYERS) {
          continue;
        }
        //добавляем в массив для последующих итераций
        potentialComb.push(suitableSeekers[j]);
        //если игра укомплектована
        if (countPlayers(potentialComb) === GAME_MAX_PLAYERS) {
          readyCombinations = potentialComb;
          break;
        }
      }
      if (readyCombinations.length !== 0) {
        break;
      }
    }
  }


}


