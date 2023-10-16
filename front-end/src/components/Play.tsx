import { Link, Outlet } from "react-router-dom";

const Game1 = () => {
    return (
        <div className="bg-blue-300 h-[200px] w-[200px]">
            <h1 className="text-2xl">Game1</h1>
        </div>
    )
}


const Game2 = () => {
    return (
        <div className="bg-green-300 h-[200px] w-[200px]">
            <h1 className="text-2xl">Game2</h1>
        </div>
    )
}


const Play = () => {
    return (
        <>
            <h1 className="text-3xl">Play</h1>
            <div className="bg-red-300 h-[400px] w-[400px] flex justify-between">
                <Link to="game1" >Blue</Link>
                <Link to="game2" >Green</Link>
                <Outlet/>
                nihayat sayr
            </div>
        </>
    )
}



export {Game1};
export {Game2};


export { Play};
