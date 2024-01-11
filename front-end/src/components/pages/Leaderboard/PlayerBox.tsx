import { AvatarBox } from "./Avatar"
import NamePoints from "./NamePoints"
import WinLoss from "./WinLoss"
import trophy from "./trophy.png";
// interface PlayerBoxProps{

// }

function PlayerBox({player, win_loss, mode, username}){
    let borderColor = "#C84D46"
    if (mode === 'powerups'){
        borderColor = "#67B9D3"
    }
    return (
        <a className="h-24 flex justify-between items-center mb-2 rounded-sm border-solid border-2 bg-gray-cl" style={{borderColor:borderColor}} href={`/user/${username}`}>
            <div className="pl-1 flex items-center">
            <AvatarBox size={player.size} src={player.src}/>
            <NamePoints name={player.name} points={player.score}/>
            </div>
            <WinLoss win={win_loss.win} loss={win_loss.loss}/>
            <img src={trophy} alt="trophy" className="p-2 bg-transparent h-12 w-12" />
        </a>
    )
}



export default PlayerBox;