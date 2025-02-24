export default function splitNumber(num) {
    let [intergetPart, decimalPart] = num.toString().split('.');
    console.log("integer part :", intergetPart, decimalPart);
    decimalPart = typeof decimalPart === "undefined" ? '0' : decimalPart;
    const finalDecimalPart = +decimalPart < 10 ? +decimalPart * 10 : +decimalPart;
    return [+intergetPart, finalDecimalPart];
}
