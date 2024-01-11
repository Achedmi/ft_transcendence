

function Modes({mode, onModeChange}) {

    function changeMode(){
        if (mode === 'classic'){
            onModeChange('powerups')
        }
        else{
            onModeChange('classic')
        }
        
    }
    let colors = {'enabledC':['#C84D46', '#692824'], 'enabledP':['#67B9D3', '#396573'],'disabled':['#C7C7C7', '#ACA2A2']}
    let backgroundColorC = mode === 'classic' ? colors['enabledC'][0] : colors['disabled'][0];
    let backgroundColorP = mode === 'classic' ? colors['disabled'][0] : colors['enabledP'][0];
    let colorC = mode === 'classic' ? colors['enabledC'][1] : colors['disabled'][1];
    let colorP = mode === 'classic' ? colors['disabled'][1] : colors['enabledP'][1];
    return(<div className="cursor-pointer select-none mt-1.5">
        <span className="p-1 text-sm rounded-l" onClick={changeMode} style={{backgroundColor:backgroundColorP, color: colorP, boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)"}}>POWERUPS</span>
    <span className="p-1 text-sm rounded-r" onClick={changeMode} style={{backgroundColor:backgroundColorC, color: colorC, boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)"}}>CLASSIC</span>
    </div>)
    
}

export default Modes;