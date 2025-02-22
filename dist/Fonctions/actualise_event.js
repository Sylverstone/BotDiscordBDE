export default async function actualise_events(bot) {
    const Guilds = bot.guilds.cache;
    for (let guild of Guilds) {
        const c = guild[1];
        console.log("checking env of guild", c.name);
        const listEvent = await c.scheduledEvents.fetch();
        listEvent.forEach(event => {
            console.log(event.entityId);
        });
    }
}
