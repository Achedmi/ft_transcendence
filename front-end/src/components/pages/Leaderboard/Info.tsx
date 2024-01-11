interface InfoProps{
    username: string;
    points: number;
    win_loss:{wins: number, losses:number};
}
function Info({username, points, win_loss}){
    return (<div className=" hidden md:block h-24 w-24 rounded-lg absolute bottom-0 mb-[-50px] right-0 truncate text-center p-3 bg-light-gray-cl border-solid border-l border-t border-dark-cl border-4 ">
        <span className=" text-sm ">{username}</span>
        <div className=" text-sm ">points: {points}</div>
        <div className=" text-sm ">wins: {win_loss.wins}</div>
        <div className=" text-sm ">losses: {win_loss.losses}</div>
    </div>)
}

export default Info;