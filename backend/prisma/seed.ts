import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
async function main() {
    const text1 = "Алиса уже почти догнала его, вслед за ним повернув за угол, но Кролика больше не было видно: она находилась в длинном низком зале, освещенном рядом ламп, свисающих с потолка. По обе стороны зала всюду были двери, но все запертые. Алиса обошла обе стены, пробуя каждую дверь, и затем печально вернулась на середину зала, спрашивая себя, каким путем и когда она выйдет отсюда. Вдруг Алиса очутилась перед маленьким трехногим столом, целиком сделанным из толстого стекла. На столе не было ничего, кроме крошечного золотого ключика.";
    const text2 = "Она тотчас решила, что ключ мог подойти к какой-нибудь из дверей зала. Увы, или замочные скважины были слишком велики, или ключ чересчур мал, но, как бы там ни было, он не отпирал ни одной двери. Однако, обходя зал во второй раз, она приблизилась к игрушечной занавеске, которой прежде не заметила. Занавеска скрывала дверцу около пятнадцати дюймов высоты.";
    const text3 = "Алиса открыла дверь и убедилась, что та вела в маленький коридор, немного более широкий, чем крысиная нора. Она стала на колени и заглянула вдоль коридора в самый чудесный сад, который вы когда-нибудь видели. Как ей захотелось выбраться из темного зала и побродить среди этих ярких цветочных клумб и прохладных фонтанов! Но она не могла даже просунуть голову в дверь. Видите ли, за последнее время с Алисой случилось столько необычайного, и она начала думать, что лишь очень немногое является действительно невозможным.";
    const text4 = "His heart was slowing now. The tremors were nearly gone. He glanced at the clock beside the bed. Not even midnight. He'd been asleep for just an hour. He looked at the nightstand, considered the bottle of pills in the top drawer. He could medicate himself into dreamless unconsciousness. But it was getting harder every time. The doses were increasing. He hadn't asked for this hell, but it had come to him. He hadn't asked to have his eyes opened, but they had been.";
    const text5 = "Offered in the form of these young, idealistic kids that had made him a part of their family. Offered in the form of their modifications and improvements to Nexus, improvements that made it an even more powerful tool for touching the minds and hearts of others. Nexus had changed him. It had shown him his actions through others' eyes. It has shown him the evil that he and all the other men like him had done. It had given him the urge to find a better way, to make a better world.";
    const text6 = "And if it had done that to him, the hardest of men, what could it do for others? Watson Cole rose and dressed for a run. He would push his superhumanly fit body to exhaustion. He wouldn't succumb to dependence on the meds. He would keep himself fit and hard. He had things to do before he paid for his crimes. The drug that had transformed him could transform the world. He would make it happen.";

    await prisma.text_to_type.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            text: text1,
            text_language: "russian",
            text_length: text1.length,
        }
    });
    await prisma.text_to_type.upsert({
        where: { id: 2 },
        update: {},
        create: {
            id: 2,
            text: text2,
            text_language: "russian",
            text_length: text2.length,
        }
    });
    await prisma.text_to_type.upsert({
        where: { id: 3 },
        update: {},
        create: {
            id: 3,
            text: text3,
            text_language: "russian",
            text_length: text3.length,
        }
    });
    await prisma.text_to_type.upsert({
        where: { id: 4 },
        update: {},
        create: {
            id: 4,
            text: text4,
            text_language: "english",
            text_length: text4.length,
        }
    });
    await prisma.text_to_type.upsert({
        where: { id: 5 },
        update: {},
        create: {
            id: 5,
            text: text5,
            text_language: "english",
            text_length: text5.length,
        }
    });
    await prisma.text_to_type.upsert({
        where: { id: 6 },
        update: {},
        create: {
            id: 6,
            text: text6,
            text_language: "english",
            text_length: text6.length,
        }
    });
    
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })