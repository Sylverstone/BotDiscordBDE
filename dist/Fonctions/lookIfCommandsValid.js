import * as fs from 'fs';
import __dirname from '../dirname.js';
import * as path from 'path';
import { pathToFileURL } from 'url';
export default function lookIfCommandsValid(commandName) {
    const ListeCommands = fs.readdirSync(path.join(__dirname, "Commands")).filter(async (commandName) => {
        const command = await import(pathToFileURL(path.join(__dirname, "Commands", commandName)).href);
        return command.notAcommand === undefined;
    }).map(commandName => commandName.slice(0, commandName.length - 3));
    return ListeCommands.includes(commandName);
}
