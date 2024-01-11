import Podium from "./Podium";
import Choices from "./Choices";
import { classic_mode_list_friends, classic_mode_list_public, power_mode_list_friends, power_mode_list_public } from "./testData";
import { useState, useEffect} from "react";
import BoardList from "./BoardList";
import PlayerBox from "./PlayerBox";
import PaginationControl from "./PaginationControl";
import Info from "./Info";

const LeaderBoard = () =>{
    //the public classic one
    // const [initialList, setInitList] = useState(['a']);

    const [publicList, setPublicList] = useState([]); //this will have both classic and powerups
    const [podium, setPodium] = useState([]);
    const [workingList, setWorkingList] = useState([])
    // default is public, friendsOnly == false
    const [friendsOnly, setFriendsOnly] = useState(false);
    //default state classic mode public list
    const [mode, setMode] = useState('classic')
    const [index, setIndex] = useState(0)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLoading(true)
        fetch(`http://${import.meta.env.VITE_ADDRESS}:9696/leaderboard/stats/public/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // setInitList(data);
                setPublicList(data)
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                console.log("the error:", error)
                setLoading(false);
            });
    }, []);
    // console.log(publicList[0])
    // if (loading){
    //     return(<div className="h-full w-full bg-repeat border-solid border-dark-cl border-[4px] rounded-xl bg-gray-cl">loading..</div>)
    // }
  

    const handleSearchTerm = (term:string) =>{
        setSearchTerm(term.toLowerCase())
    }

    
    
    const handleIndexChange = (newIndex:number) =>{
        setIndex(newIndex)
    }
 
    // const handleFriendsChange = (newState:boolean) => {
    //     setFriendsOnly(newState);
    // };

    const handleModeChange = (newMode:string) =>{
        setMode(newMode);
    }

    useEffect(() => {
        const firstList = Array.isArray(publicList[0]) ? publicList[0] : [];
        const secondList = Array.isArray(publicList[1]) ? publicList[1] : [];

        if (mode === 'classic') {
            setPodium(firstList.slice(0,3))
            setWorkingList(firstList.slice(3))
            // setList(the_list);
        } 
        else{
            setPodium(secondList.slice(0,3))
            setWorkingList(secondList.slice(3))
        }
    }, [friendsOnly, mode, publicList]);



    const [displayedPlayers, setDisplayedPlayers] = useState([]);
    useEffect(() => {
            const filteredPlayers = workingList.filter(player => player.username.toLowerCase().includes(searchTerm)).slice(index, index + 3);
        setDisplayedPlayers(filteredPlayers)
    }, [workingList, index, searchTerm]);


    let pageNumber = workingList ? Math.ceil(workingList.length / 3) : 1;
    if (pageNumber === 0){
        pageNumber = 1
    }
    return(
        <div className="h-full w-full bg-repeat border-solid border-dark-cl border-[4px] rounded-xl bg-gray-cl">
      {podium.length > 0 && <Podium firsts={podium} mode={mode}/>}
      
      <Choices onModeChange={handleModeChange} mode={mode} onSearchTerm={handleSearchTerm}/>
      <BoardList mode={mode}>
        {displayedPlayers.map((x) => {
        return <PlayerBox  mode={mode} player={{size: 60, src: x.avatar, name: x.username, score: x.totalScore}} win_loss={{win: x.wins, loss: x.losses}} username={x.username}/>;
        })}
        </BoardList>
        <PaginationControl pageNumber={pageNumber} mode={mode} onIndexChange={handleIndexChange} />
   </div>
    )
}

export default LeaderBoard;