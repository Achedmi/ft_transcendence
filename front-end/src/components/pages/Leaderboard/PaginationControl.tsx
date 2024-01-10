import { useState, useEffect } from "react"
import "./styles.css"

// import "../styles/tailwind.css"

//decrease transparency on click
function PaginationControl({pageNumber=3, size=7, mode, onIndexChange}){

    // let opacity = '0.64'
    // function changeIndex(){
    //     onIndexChange()
    // }

    const [activeIndex, setActiveIndex] = useState(null)
    const [opacity, setOpacity]  = useState('0.64')
    let backgroundColor = `rgba(200, 77, 70, ${opacity})`
    if (mode === 'powerups'){
        backgroundColor = `rgba(103, 185, 211, ${opacity})`
    }
    function clickCircle(index){
        console.log("index = ", index + 1)
        onIndexChange(index * 3) 
        setOpacity(1);
        setActiveIndex(index)
    }

    // reset the toggle buttons when i click outside of them
    // function handleClickOutside(event) {
    //     // If the clicked target is not part of the pagination, reset the activeIndex and opacity
    //     if (!event.target.classList.contains('pagination')) {
    //         setActiveIndex(null);
    //         setOpacity('0.64');
    //     }
    // }
    // useEffect(() => {
    //     // Add event listener when the component mounts
    //     window.addEventListener('click', handleClickOutside);
    //     // Remove event listener on cleanup when the component unmounts
    //     return () => window.removeEventListener('click', handleClickOutside);
    // }, []);

    let range = []
    for (let i = 0; i < pageNumber; i++){
        range.push(i)
    }
    //make it affect only one circle
    return (<div className="flex justify-center">
        {range.map((index)=>{return <span key={index} onClick={() => clickCircle(index)} style={{backgroundColor: backgroundColor, width: activeIndex === index ? size * 2 : size , height: activeIndex === index ? size * 2 : size }} className="rounded-full cursor-pointer m-1 mt-3"></span>})}
    </div>)
}

export default PaginationControl