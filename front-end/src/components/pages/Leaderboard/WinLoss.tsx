
function WinLoss({win, loss}){
    return(
        <div className="md:pr-20">
            <span className = "p-1 text-win-color font-extrabold text-sm md:text-lg">{win}</span>
            {/* <span ></span> */}
            <span className="seperator text-lose-color font-extrabold relative p-1 text-sm md:text-lg">{loss}</span>
        </div>
    )

}

export default WinLoss