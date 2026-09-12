import CBot from "../Class/CBot.js";
import { APIEmbedField } from "discord.js";
import {doesGuildHaveParams, getReunion, getReunionSalonId, setRappelMatinal} from "./DbFunctions.js";

async function addPeopleInComeField(ComeField : APIEmbedField, DontComeField : APIEmbedField, userID : string)
{
    if(ComeField.value.includes(userID))
        return;

    if(ComeField.value == "Aucune idée")
        ComeField.value = "";

    ComeField.value += userID;
    DontComeField.value = DontComeField.value.replace(userID,"");

    if(DontComeField.value == "")
    {
        DontComeField.value = "Aucune idée";
    }
}


async function addPeopleInDontComeField(ComeField : APIEmbedField, DontComeField : APIEmbedField, userID : string)
{
    if(DontComeField.value.includes(userID))
        return;

    if(DontComeField.value == "Aucune idée")
        DontComeField.value = "";

    DontComeField.value += userID;
    ComeField.value = ComeField.value.replace(userID,"");

    if(ComeField.value == "")
        ComeField.value = "Aucune idée";
}

async function executeInterval(bot : CBot)
{
    for(const [id,guild] of bot.guilds.cache)
    {
        const guildHaveParams = await doesGuildHaveParams(bot, id);
        if (!guildHaveParams)
            continue;

        try {
            const Reunion = await getReunion(bot, id);
            const {
                heuredebut,
                heurefin,
                sujet,
                info_en_plus,
                date,
                idReunion,
                rappel_reunion,
                rappel_matinal
            } = Reunion;
            const currentHour = new Date().getHours();
            const reunionSalonId = await getReunionSalonId(bot, id);

            const ReunionSalon = await guild.channels.fetch(reunionSalonId);
            if (!ReunionSalon) {
                console.error("Le salon de réunion n'a pas été trouvé");
                return;
            }

            if (!ReunionSalon.isSendable())
                return;

            if ((currentHour == 6 || true) && !rappel_matinal) {

                const message = await ReunionSalon.send({
                    embeds: [
                        {
                            title: "Reunion",
                            description: "@everyone vous avez réunion aujourd'hui",
                            color: 0xff5036,
                            fields: [
                                {
                                    name: "Qui viens ?",
                                    value: "Aucune idée"
                                },
                                {
                                    name: "Qui viens pas ?",
                                    value: "Aucune idée"
                                }
                            ]
                        }
                    ]
                });

                await Promise.all([
                    message.react("👍"),
                    message.react("👎")
                ])

                const co = message.createReactionCollector({
                    time: 24 * 1000 * 60 * 60
                })

                co.on("collect", async (reaction, user) => {

                    await reaction.fetch();
                    console.log("collecttttt")
                    console.log(reaction.emoji.toString());

                    const i = await reaction.message.fetch();
                    const embed = i.embeds[0];
                    const QuiViensField = embed.fields.find(field => {
                        return field.name === "Qui viens ?"
                    });
                    const QuiViensPas = embed.fields.find(field => field.name === "Qui viens pas ?");

                    if (!QuiViensField || !QuiViensPas)
                        return;

                    if (reaction.emoji.toString() == "👍") {
                        await addPeopleInComeField(QuiViensField, QuiViensPas, user.toString());
                    } else if (reaction.emoji.toString() == "👎") {
                        await addPeopleInDontComeField(QuiViensField, QuiViensPas, user.toString());
                    } else {
                        //await reaction.remove();
                    }

                    const users = await reaction.users.fetch();
                    console.log(users);
                    console.log(message.reactions.cache.map(r => r.users.cache.map(u => u.displayName)));
                    await reaction.users.fetch();


                    const userReactions =
                        message.reactions.cache.filter(
                        async r => {
                            await r.users.fetch();
                            return r.users.cache.has(user.id);
                        });

                    console.log(userReactions.map(e => e.users.cache.map(u => u.displayName)));
                    for (const react of userReactions.values()) {
                        if(react.message.toString() != reaction.message.toString())
                        {
                            await react.users.fetch();
                            react.users.remove(user.id);
                        }
                    }
                    console.log(message.reactions.cache.size);
                    //Réagir qu'une seule fois, supprime l'autre réaction sion

                    await message.edit({embeds: [embed]});
                })

                co.on("end", (collected, reason) => {
                    console.log("collector ended");
                })

                await setRappelMatinal(bot, idReunion);
            }
            // else if(currentHour + 1 >= heuredebut && !rappel_reunion && false){
            //     //Rappel parce que la réunion c'est bientôt
            //     ReunionSalon.send({ embeds : [
            //
            //             {
            //                 title : "Reunion",
            //                 description : "@everyone "
            //             }
            //         ]})
            // }

        } catch (err) {

        }
    }
}

export default async function LookForReunion(bot : CBot)
{
    await bot.guilds.fetch();
    executeInterval(bot);
    setInterval(async () => {
        try {
            await executeInterval(bot);
        }
        catch (err)
        {
            console.error(err);
        }
    },1 * 1000 * 60)
}