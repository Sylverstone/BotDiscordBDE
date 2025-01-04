
export async function changeValueFromFile(goalStr,optionName,file = "data.txt")
{
    const options = message.options.get("date_reunion");
    const goal = "prochainereunion";
    let indexGoal = null;
    const fluxLecture = fs.createReadStream("data.txt")
    const rl = readline.createInterface(
        {
            input :fluxLecture,
            crlfDelay: Infinity,
        }
    )

    let allLines = []
    if(options !== null)
    {
        let { value } = options;
        
        if(typeof value === "string")
        {
            console.log(typeof value)
            //value = value.replaceAll('-','/')
            
            
            console.log(value)

            
            rl.on('line', line => {
                console.log(line)
                allLines.push(line)
                if(line.toLowerCase() === goal)
                {
                    indexGoal = allLines.length - 1;
                }
            })

            await events.once(rl,'close');
        }
    }

    return allLines[indexGoal+1],indexGoal,allLines,value
}