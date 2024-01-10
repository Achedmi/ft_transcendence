interface FriendsProps{
    friendsOnly: boolean;
    onFriendsChange: (newState: boolean) => void;
    mode: string
}

function Friends({ friendsOnly, onFriendsChange, mode }) {
    const changeVisibility = () => {
        onFriendsChange(!friendsOnly); // Inform the parent component about the change
    };

    let backgroundColor = mode == 'classic' ? "#C84D46" : "#67B9D3"; 
    let color = mode == 'classic' ? "#86332F" : "#396573";
    if (!friendsOnly){
        backgroundColor = "#C7C7C7";
        color = "#ACA2A2"
    }
    return (
        <div className="rounded-sm h-7 text-sm p-1 cursor-pointer select-none" onClick={changeVisibility} style={{ color: color, backgroundColor: backgroundColor , boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)"}}>
            FRIENDS ONLY
        </div>
    );
}


export default Friends;