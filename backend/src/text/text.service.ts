import { Injectable } from '@nestjs/common';
import { Prisma, text_to_type } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TextService {
    constructor(private prisma: PrismaService){}

    findOne(textWhereUniqueInput: Prisma.text_to_typeWhereUniqueInput){
        return this.prisma.text_to_type.findUnique({
            where: textWhereUniqueInput
        });
    }

    getRandomText():Promise<text_to_type>{
        return this.prisma.$queryRaw`select * from text_to_type order by random() limit 1;`;
    }
}
