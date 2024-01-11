


function SearchBar({onSearchTerm}){
    const handleInputChange = (e) => {
        onSearchTerm(e.target.value); // Call the passed handler with new input value
    };
    return (<div className=""> 
        <input type="text" className="rounded-m bg-disabled-color h-8 text-center outline-none" placeholder="find a player" onChange={handleInputChange} style={{boxShadow: '0px 4px 4px 0px rgba(0,0,0,0.25)'}}/>
    </div>)
}

export default SearchBar