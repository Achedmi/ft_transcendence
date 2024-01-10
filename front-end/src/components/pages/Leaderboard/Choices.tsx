import Friends from "./Friends";
import SearchBar from "./SearchBar";
import Modes from "./Modes";
interface ChoicesProps{
    friendsOnly: boolean;
    mode: string;
    onFriendsChange: (newState: boolean) => void;
    onModeChange: (newMode: string) => void;
    onSearchTerm: (term: string) => void;
}

function Choices({friendsOnly=true,
     mode="classic",
      onFriendsChange, 
      onModeChange,
       onSearchTerm}: ChoicesProps){
    return (<div className="flex justify-around mt-10">
        <Friends  friendsOnly={friendsOnly} onFriendsChange={onFriendsChange} mode={mode}/>
        <SearchBar onSearchTerm={onSearchTerm}/>
        <Modes mode={mode} onModeChange={onModeChange}/>
    </div>)
}

export default Choices;