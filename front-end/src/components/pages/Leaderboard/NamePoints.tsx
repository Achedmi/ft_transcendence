
function NamePoints({name, points, rank=0}){
    return(
        <div className="pl-1 md:pl-2">
            <p className="text-xs font-extrabold md:text-lg">{name}</p>
            <p className="text-black/50 text-xs md:text-lg">points: {points}  Rank: {rank}</p>
       </div>
    )
}

export default NamePoints;