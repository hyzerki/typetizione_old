import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "Socket.IO";

interface Player {
  player_id: string;
  username: string;
}

interface Lobby {
  id: string;
  players: Array<Player>;
}




//Хранит список лобби
//todo перенести хранение лобби в redis
const lobbies: Map<string, Lobby> = new Map();

@WebSocketGateway({
  cors: { origin: "*" },
  serveClient: false,
  namespace: "lobby",
})
export default class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

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
  @SubscribeMessage("accept_invite")
  handleAcceptInvite(client: Socket, payload: any) {
    const player_id = client.data.player_id as string;
    const username = client.data.username as string;
    const currentLobbyId = client.data.lobby_id as string;
    const newLobby = [...lobbies.values()].find(entry => entry.players.some(player => player.player_id === payload));
    const currentLobby = lobbies.get(currentLobbyId);

    //fix возможность присоединиться в текущее лобби

    if (currentLobby.players.length <= 1) {
      lobbies.delete(currentLobbyId);
    } else {
      currentLobby.players = currentLobby.players.filter(p => p.player_id != player_id);
      this.server.to(currentLobby.id).emit("log", `Игрок ${username} покинул группу.`)
    }
    client.leave(currentLobbyId);

    client.data.lobby_id = newLobby.id;
    lobbies.get(newLobby.id).players.push({ player_id, username });
    client.join(newLobby.id);
    this.server.to(newLobby.id).emit("log", `Игрок ${username} присоединился к группе.`)
  }

  /**
   * При подключении в хендшейк передаётся айди и имя игрока сохраняется информация о лобби, в котором находится игрок, а также игрок добавляется в комнату со своим айди переданным в хендшейке. В хендшейк записывается айди лобби, чтобы было удобнее его находить
   * @param client В хендшейке хранит {player_id: string, username: string}
   * @param args 
   */
  handleConnection(client: Socket, ...args: any[]) {
    console.log("New client");
    const player_id = client.handshake.query.player_id as string;
    const username = client.handshake.query.username as string;
    console.log(client.handshake.query);
    client.data.player_id = player_id;
    client.data.username = username;
    client.data.lobby_id = client.id;
    lobbies.set(client.id, { id: client.id, players: [{ player_id, username }] });
    client.join(player_id);
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
    this.server.to(client.data.lobby_id).emit("message", { data: client.data, text:payload });
    console.log("sent");
  }




/**
 * Начинает поиск, создаёт объект в котором хранится как и в лобби список игроков и нижняя и верхняя граница поиска.
 * Граница: самый большой рейтинг в группе +300 и самый маленьгий -300.
 * Границы рейтинга расширяются каждые 10сек по +100 и -100 и во время расширения снова проверяются все игроки в поиске, для нахождения подходящего вод границы.
 * Так же при подключении игрока в поиск проверяется, подходит ли он по рейтингу к уже существующим группам, ведущим поиск
 * @param client игрок, нажавший кнопку поиска
 * @param payload 
 */
  @SubscribeMessage("start_ranked")
  handleStartRankedSearch(client:Socket, payload: any) {

  }
}
