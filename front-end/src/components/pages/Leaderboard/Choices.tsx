import Friends from "./Friends";
import SearchBar from "./SearchBar";
import Modes from "./Modes";
interface ChoicesProps{
    mode: string;
    onModeChange: (newMode: string) => void;
    onSearchTerm: (term: string) => void;
}

function Choices({
     mode="classic",
      onModeChange,
       onSearchTerm}: ChoicesProps){
    return (<div className="flex justify-around mt-10">
        {/* <Friends  friendsOnly={friendsOnly} onFriendsChange={onFriendsChange} mode={mode}/> */}
        <SearchBar onSearchTerm={onSearchTerm}/>
        <Modes mode={mode} onModeChange={onModeChange}/>
    </div>)
}

export default Choices;