export default function transfromOptionToObject(message) {
    let ObjectIsReal = false;
    let optionObject = {};
    let option = message.options.data;
    if (option !== null) {
        option.forEach(o => { optionObject[o.name] = o.value; ObjectIsReal = true; });
    }
    return { optionObject, ObjectIsReal };
}
