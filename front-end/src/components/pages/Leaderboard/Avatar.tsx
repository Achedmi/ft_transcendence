import "./styles.css"
import Info from "./Info"
import {useState} from 'react'

export function Avatar({src="", name="unknown", borderColor="#433650", rank="1st", boxShadow="0px 4px 12px 1px rgba(200,77,70,0.75)", points}){
    // const []
    const [visibleInfo, setInfo] = useState(false)
    
    // const handleInfo(){
    //     setInfo(true)
    // }
    return(
       <div className="avatar-container bg-transparent relative" onMouseEnter={() => setInfo(true)} onMouseLeave={()=> setInfo(false)}>
           <p className="text-center bg-transparent font-black text-sm md:text-lg lg:text-xl mt-2">{rank}</p>
           <img className=" rounded-full border-solid border-4 w-16 md:border-4 md:w-24 lg:w-32" src={src} alt={name} style={{borderColor: borderColor, boxShadow:boxShadow}}/>
           
            {visibleInfo && <Info username={name} points={points}/>}
       </div>
    )
   }
   
   export function AvatarBox({src="", name="unknown", borderColor="#433650"}){
       return(
          <div className="">
              <img className="rounded-full border-solid border-4 w-16" src={src} alt={name} style={{borderColor: borderColor}}/>
          </div>
       )
      }

      