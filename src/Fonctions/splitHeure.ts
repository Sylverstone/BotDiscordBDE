export default function splitNumber(num : number)
{
    let [intergetPart, decimalPart] = num.toString().split('.');
    decimalPart = typeof decimalPart === "undefined" ? '0' : decimalPart;
    const finalDecimalPart = +decimalPart < 10 ? +decimalPart * 10 : +decimalPart;
    return [+intergetPart,finalDecimalPart];
}