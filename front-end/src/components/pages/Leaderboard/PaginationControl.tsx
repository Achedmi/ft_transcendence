import { useState, useEffect } from "react"
import "./styles.css"

// import "../styles/tailwind.css"

//decrease transparency on click

interface paginationProps{
    pageNumber: number;
    mode: 'classic' | 'powerups';
    nIndexChange : (index: number) => void
}
function PaginationControl({pageNumber, mode, onIndexChange}:paginationProps){

    // let opacity = '0.64'
    // function changeIndex(){
    //     onIndexChange()
    // }
    const size = 7
    const [activeIndex, setActiveIndex] = useState(0)
    const [opacity, setOpacity]  = useState('0.64')

    // let backgroundColor = `rgba(200, 77, 70, ${opacity})`
    // if (mode === 'powerups'){
    //     backgroundColor = `rgba(103, 185, 211, ${opacity})`
    // }
    function clickCircle(index){
        // console.log("index = ", index + 1)
        onIndexChange(index * 3) 
        // setOpacity(1);
        setActiveIndex(index)
    }
    function returnColor(opacity){
        if (mode === 'classic')
            return `rgba(200, 77, 70, ${opacity})`
        else
            return `rgba(103, 185, 211,  ${opacity})`
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
        {range.map((index)=>{return <span key={index} onClick={() => clickCircle(index)} style={{backgroundColor: activeIndex === index ? returnColor(1) : returnColor(0.64), width: activeIndex === index ? size * 2 : size , height: activeIndex === index ? size * 2 : size }} className="rounded-full cursor-pointer m-1 mt-3"></span>})}
    </div>)
}

export default PaginationControl