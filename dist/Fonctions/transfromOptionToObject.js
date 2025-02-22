export default function transfromOptionToObject(message) {
    let optionObject = {};
    let option = message.options.data;
    if (option !== null) {
        option.forEach(o => { optionObject[o.name] = o.value; });
    }
    return optionObject;
}
