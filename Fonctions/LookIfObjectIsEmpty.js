
export default function EmptyObject(object){
    for(let key in object)
    {
        return false;
    }
    return true;
}