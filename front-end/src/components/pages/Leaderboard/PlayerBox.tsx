import { AvatarBox } from "./Avatar"
import NamePoints from "./NamePoints"
import WinLoss from "./WinLoss"
import trophy from "./trophy.png";
// interface PlayerBoxProps{

// }

function PlayerBox({player, win_loss, mode, username, rank}){
    let borderColor = "#C84D46"
    let hoverColor = "hover:bg-red-cl";
    if (mode === 'powerups'){
        borderColor = "#67B9D3"
        hoverColor = "hover:bg-blue-cl";
    }
    
    return (
        // <div className="">
        <a className={`h-24 flex justify-between items-center mb-2 rounded-sm border-solid border-2 bg-gray-cl ${hoverColor}`} style={{borderColor:borderColor}} href={`/user/${username}`}>
            <div className="pl-1 flex items-center">
            {/* <span className="text-5xl p-2 pb-2 opacity-50">{rank}</span> */}
            <AvatarBox size={player.size} src={player.src}/>
            <NamePoints name={player.name} points={player.score} rank={rank}/>
            </div>
            {/* <span className="text-xl">{rank}</span> */}
            <WinLoss win={win_loss.win} loss={win_loss.loss}/>
            <img src={trophy} alt="trophy" className="p-2 bg-transparent h-12 w-12" />
        </a>

    )
}



export default PlayerBox;