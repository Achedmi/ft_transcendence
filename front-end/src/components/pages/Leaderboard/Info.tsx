
interface InfoProps{
    username: string;
    points: number;
    win_loss:{win: number, losses:number};
}
function Info({username, points, win_loss}:InfoProps){
    return (<div className="bg-white h-24 w-24 rounded-lg absolute bottom-0 mb-[-50px] right-0 truncate">
        <span className=" text-sm ">{username}</span>
        <div className=" text-sm ">{points}</div>
    </div>)
}

export default Info;