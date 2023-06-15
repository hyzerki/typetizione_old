import { Controller, Get } from '@nestjs/common';
import { TextService } from './text.service';

@Controller('text')
export class TextController {
    constructor(private textService: TextService) {}
    
    @Get("random")
    getRandom(){
        return this.textService.getRandomText();
    }
}
