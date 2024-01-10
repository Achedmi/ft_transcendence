
function NamePoints({name, points}){
    return(
        <div className="pl-1 md:pl-2">
            <p className="text-xs font-extrabold md:text-lg">{name}</p>
            <p className="text-black/50 text-xs md:text-lg">{points} points</p>
       </div>
    )
}

export default NamePoints;