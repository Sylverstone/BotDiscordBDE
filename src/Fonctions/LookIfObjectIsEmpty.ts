
export default function EmptyObject(object : object){
    for(let key in object)
    {
        return false;
    }
    return true;
}