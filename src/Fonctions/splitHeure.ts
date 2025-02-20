export default function splitNumber(num : number)
{
    let [intergetPart, decimalPart] = num.toString().split('.');
    decimalPart = decimalPart === undefined ? '' : decimalPart;
    return [+intergetPart,(+decimalPart)*10];
}