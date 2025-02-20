export default function make_log(succes, message) {
    if (succes) {
        console.log(`[LOG] Commande effectuée avec succès : ${message.commandName}`);
    }
    else {
        console.error(`[ERROR] Impossible d'effectuer la commande : ${message.commandName}`);
    }
}
