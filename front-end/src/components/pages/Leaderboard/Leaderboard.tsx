import Podium from "./Podium";
import Choices from "./Choices";
import { classic_mode_list_friends, classic_mode_list_public, power_mode_list_friends, power_mode_list_public } from "./testData";
import { useState, useEffect} from "react";
import BoardList from "./BoardList";
import PlayerBox from "./PlayerBox";
import PaginationControl from "./PaginationControl";

const LeaderBoard = () =>{

    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchTerm = (term:string) =>{
        setSearchTerm(term.toLowerCase())
    }

    // default is public, friendsOnly == false
    const [friendsOnly, setFriendsOnly] = useState(false);
    //default state classic mode public list
    const [the_list, setList] = useState(classic_mode_list_public);
    const [mode, setMode] = useState('classic')
    const [index, setIndex] = useState(0)
    
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
            setList(classic_mode_list_friends);
        } 
        else if (!friendsOnly && mode === 'classic') {
            setList(classic_mode_list_public);
        }
        else if (friendsOnly && mode === 'powerups'){
            setList(power_mode_list_friends)
        }
        else{
            setList(power_mode_list_public)
        }
    }, [friendsOnly, mode]);



    const [displayedPlayers, setDisplayedPlayers] = useState([]);
    // const [i, setI] = useEffect(0)
    // let i = 0
    useEffect(() => {

        const filteredPlayers = the_list
            .filter(player => player.name.toLowerCase().includes(searchTerm))
            .slice(index, index + 3);
        // setDisplayedPlayers(the_list.slice(index, index + 3));
        // console.log(displayedPlayers)
        // setRemainingPlayers(the_list.slice(3));
        setDisplayedPlayers(filteredPlayers)
    }, [the_list, index, searchTerm]);


    let pageNumber  = Math.ceil(the_list.length/3)
    return(
        <div className="h-full w-full bg-repeat border-solid border-dark-cl border-[4px] rounded-xl bg-gray-cl">
      <Podium  mode={mode}/>
      <Choices friendsOnly={friendsOnly} onFriendsChange={handleFriendsChange} onModeChange={handleModeChange} mode={mode} onSearchTerm={handleSearchTerm}/>
      <BoardList mode={mode}>
        {displayedPlayers.map((x) => {
        return <PlayerBox mode={mode} player={{size: 60, src: x.src, name: x.name, score: x.points}} win_loss={{win: x.wins, loss: x.loss}} />;
        })}
        </BoardList>
        <PaginationControl pageNumber={pageNumber} mode={mode} onIndexChange={handleIndexChange} />
   </div>
    )
}

export default LeaderBoard;