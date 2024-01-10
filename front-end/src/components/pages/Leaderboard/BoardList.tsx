
function BoardList(props){
   let backgroundColor = "rgba(217, 199, 198, 0.5)"
   if (props.mode == 'powerups'){
        backgroundColor= "rgba(103, 185, 211, 0.43)"
    }
    return (<div className="flex flex-col mx-auto  mt-5 h-2/5 md:p-4 rounded-lg w-72 md:w-3/4" style={{backgroundColor: backgroundColor}}>
        {props.children}
    </div>)
}

export default BoardList;