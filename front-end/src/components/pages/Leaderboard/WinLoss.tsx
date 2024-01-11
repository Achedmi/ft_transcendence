
function WinLoss({win, loss}){
    return(
        <div className="md:pr-20">
            <span title="wins" className = "p-1 text-win-color font-extrabold text-sm md:text-lg cursor-pointer">{win}</span>
            {/* <span ></span> */}
            <span title="losses" className="seperator text-lose-color font-extrabold relative p-1 text-sm md:text-lg cursor-pointer">{loss}</span>
        </div>
    )

}

export default WinLoss