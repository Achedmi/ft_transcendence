import "./styles.css"

import {Avatar} from "./Avatar";
import { first_3 } from "./testData";
function Podium({mode=''}){

    let borderColor = mode === 'classic' ? "#C84D46" : "#67B9D3"
    let boxShadow = mode === 'classic' ? "0px 4px 12px 1px rgba(200,77,70,0.75)": "0px 4px 12px 1px rgba(103, 185, 211, 0.75)"
    
    return (
        <div className="container-podium flex bg-podium-color justify-around h-60 m-0.5 shadow-md" style={{borderRadius: "47% 53% 50% 50% / 0% 0% 100% 100%"}}>
        <Avatar src={first_3[0].src} rank="2nd" boxShadow="0px 4px 12px 1px #433650" />
        <Avatar src={first_3[1].src} borderColor={borderColor} boxShadow={boxShadow}/>
        <Avatar src={first_3[2].src} rank="3th" boxShadow="0px 4px 12px 1px #433650"/>
        </div>
    )
}

export default Podium;