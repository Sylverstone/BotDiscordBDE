export default function splitNumber(num) {
    let [intergetPart, decimalPart] = num.toString().split('.');
    decimalPart = decimalPart === undefined ? '' : decimalPart;
    return [+intergetPart, (+decimalPart) * 10];
}
