import * as fs from 'fs';
import __dirname from '../dirname.js';
import * as path from 'path';
import { pathToFileURL } from 'url';
export default function lookIfCommandsValid(commandName) {
    const specialFile = ["event", 'reunion'];
    const ListeCommands = fs.readdirSync(path.join(__dirname, "Commands")).filter(async (cName) => {
        if (cName.endsWith(".js")) {
            const command = await import(pathToFileURL(path.join(__dirname, "Commands", cName)).href);
            return command.notAcommand === undefined;
        }
        return false;
    }).map(cName => cName.slice(0, cName.length - 3));
    const additionalFile = ["Event", "Reunion"];
    for (const dos of additionalFile) {
        const additionalScript = fs.readdirSync(path.join(__dirname, "Commands", dos)).filter(file => !file.startsWith("_"))
            .map(file => file.slice(0, file.length - 3));
        ListeCommands.push(...additionalScript);
    }
    return ListeCommands.includes(commandName);
}
