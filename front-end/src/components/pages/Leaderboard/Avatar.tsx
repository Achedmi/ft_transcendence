import "./styles.css"

export function Avatar({src="", name="unknown", borderColor="#433650", rank="1st", boxShadow="0px 4px 12px 1px rgba(200,77,70,0.75)"}){
    return(
       <div className="avatar-container bg-transparent">
           <p className="text-center bg-transparent font-black text-sm md:text-lg lg:text-xl mt-2">{rank}</p>
           <img className="rounded-full border-solid border-4 w-16 md:border-4 md:w-24 lg:w-32" src={src} alt={name} style={{borderColor: borderColor, boxShadow:boxShadow}}/>
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

      