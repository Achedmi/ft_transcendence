import Podium from "./Podium";
import Choices from "./Choices";
import { classic_mode_list_friends, classic_mode_list_public, power_mode_list_friends, power_mode_list_public } from "./testData";
import { useState, useEffect} from "react";
import BoardList from "./BoardList";
import PlayerBox from "./PlayerBox";
import PaginationControl from "./PaginationControl";

const LeaderBoard = () =>{
    //the public classic one
    // const [initialList, setInitList] = useState(['a']);

    const [publicList, setPublicList] = useState([[{username:"dummy"}], [{username:"dummy"}]]);
    const [workingList, setWorkingList] = useState([{username:"dummy"}])
    // default is public, friendsOnly == false
    const [friendsOnly, setFriendsOnly] = useState(false);
    //default state classic mode public list
    const [mode, setMode] = useState('classic')
    const [index, setIndex] = useState(0)
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
                // setLoading(false);
            })
            .catch(error => {
                setError(error);
                console.log("the error:", error)
                // setLoading(false);
            });
    }, []);
    // console.log(the_list)

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchTerm = (term:string) =>{
        setSearchTerm(term.toLowerCase())
    }

    
    
    const handleIndexChange = (newIndex:number) =>{
        setIndex(newIndex)
    }
 
    const handleFriendsChange = (newState:boolean) => {
        setFriendsOnly(newState);
    };

    const handleModeChange = (newMode:string) =>{
        setMode(newMode);
    }

    useEffect(() => {
        if (friendsOnly && mode === 'classic') {
            setWorkingList(publicList[0])
            // setList(the_list);
        } 
        else if (!friendsOnly && mode === 'classic') {
            setWorkingList(publicList[0])
            // setList(the_list);
        }
        else if (friendsOnly && mode === 'powerups'){
            setWorkingList(publicList[1])
            // setList(the_list)
        }
        else{
            setWorkingList(publicList[1])
            // setList(the_list)
        }
    }, [friendsOnly, mode]);



    const [displayedPlayers, setDisplayedPlayers] = useState([]);
    useEffect(() => {
            const filteredPlayers = workingList.filter(player => player.username.toLowerCase().includes(searchTerm)).slice(index, index + 3);
        // setDisplayedPlayers(the_list.slice(index, index + 3));
        // console.log(displayedPlayers)
        // setRemainingPlayers(the_list.slice(3));
        setDisplayedPlayers(filteredPlayers)
    }, [workingList, index, searchTerm]);


    let pageNumber = workingList ? Math.ceil(workingList.length / 3) : 0;
    return(
        <div className="h-full w-full bg-repeat border-solid border-dark-cl border-[4px] rounded-xl bg-gray-cl">
      <Podium  mode={mode}/>
      <Choices friendsOnly={friendsOnly} onFriendsChange={handleFriendsChange} onModeChange={handleModeChange} mode={mode} onSearchTerm={handleSearchTerm}/>
      <BoardList mode={mode}>
        {displayedPlayers.map((x) => {
        return <PlayerBox  mode={mode} player={{size: 60, src: x.avatar, name: x.username, score: x.totalScore}} win_loss={{win: x.wins, loss: x.losses}} />;
        })}
        </BoardList>
        <PaginationControl pageNumber={pageNumber} mode={mode} onIndexChange={handleIndexChange} />
   </div>
    )
}

export default LeaderBoard;