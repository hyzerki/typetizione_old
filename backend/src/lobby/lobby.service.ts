import { Injectable } from '@nestjs/common';
import {v4} from "uuid";

@Injectable()
export class LobbyService {
    generateNewLobbyUUID(): string{
        return v4();
    }
}
