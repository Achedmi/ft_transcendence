import "./styles.css"
import { first_2, first_3, first_1 } from "./testData";
import {Avatar} from "./Avatar";

function Podium({mode='', firsts=[]}){

    // firsts = first_3
    let borderColor = mode === 'classic' ? "#C84D46" : "#67B9D3"
    let boxShadow = mode === 'classic' ? "0px 4px 12px 1px rgba(200,77,70,0.75)": "0px 4px 12px 1px rgba(103, 185, 211, 0.75)"
    
    if (firsts.length == 1){
       return (<div className="container-podium flex bg-podium-color justify-around h-60 m-0.5 shadow-md" style={{borderRadius: "47% 53% 50% 50% / 0% 0% 100% 100%"}}>
        <Avatar src={firsts[0].avatar} borderColor={borderColor} boxShadow={boxShadow} username={firsts[0].username} points={firsts[0].totalScore} win_loss={{ wins: firsts[0].wins, losses: firsts[0].losses }} />
        </div>)
    }
    else if (firsts.length == 2){
        return (<div className="container-podium flex bg-podium-color justify-around h-60 m-0.5 shadow-md" style={{borderRadius: "47% 53% 50% 50% / 0% 0% 100% 100%"}}>
        <Avatar src={firsts[0].avatar} borderColor={borderColor} boxShadow={boxShadow} username={firsts[0].username} points={firsts[0].totalScore}  win_loss={{ wins: firsts[1].wins, losses: firsts[1].losses }}/>
        <Avatar src={firsts[1].avatar} rank="2nd" borderColor={borderColor} boxShadow={boxShadow} username={firsts[1].username} points={firsts[1].totalScore}  win_loss={{ wins: firsts[1].wins, losses: firsts[1].losses }}/>
        </div>)
    }
    else{
        return (
        <div className="container-podium flex bg-podium-color justify-around h-60 m-0.5 shadow-md" style={{borderRadius: "47% 53% 50% 50% / 0% 0% 100% 100%"}}>
        <Avatar src={firsts[1].avatar} rank="2nd" boxShadow="0px 4px 12px 1px #433650"  username={firsts[1].username} points={firsts[1].totalScore} win_loss={{ wins: firsts[1].wins, losses: firsts[1].losses }}/>
        <Avatar src={firsts[0].avatar} borderColor={borderColor} boxShadow={boxShadow} username={firsts[0].username} points={firsts[0].totalScore} win_loss={{ wins: firsts[0].wins, losses: firsts[0].losses }}/>
        <Avatar src={firsts[2].avatar} rank="3th" boxShadow="0px 4px 12px 1px #433650" username={firsts[2].username} points={firsts[2].totalScore} win_loss={{ wins: firsts[2].wins, losses: firsts[2].losses }}/>
        </div>
    )
    }
    
}

export default Podium;