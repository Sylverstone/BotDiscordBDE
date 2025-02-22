export default function splitNumber(num : number)
{
    let [intergetPart, decimalPart] = num.toString().split('.');
    console.log("integer part :",intergetPart, decimalPart);
    decimalPart = typeof decimalPart === "undefined" ? '0' : decimalPart;
    return [+intergetPart,(+decimalPart)*10];
}