function createCharityPage({createChar}){
    function create(){
        var name = document.getElementById("name").value;
        var amount = document.getElementById("amount").value;
        var cause = document.getElementById("cause").value;
        var autoCheckout = document.getElementById("autoCheckout").value;
        createChar(name,amount,cause,autoCheckout);
    }
    return(
        <div className="enterInfo">
            
                <label>Enter the name of the charity</label>
                <input type="text" id="name" className="inputBox"></input>
                <label>Enter the amount of the charity</label>
                <input type="text" id="amount" className="inputBox"></input>
                <label>Enter the cause of the charity</label>
                <input type="text" id="cause" className="inputBox"></input>
                <label>Enter the autoCheckout of the charity</label>
                <select className="inputBox" id="autoCheckout">
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
                <button className="GoBtn" onClick={()=>create()}>Confirm</button>
            
        </div>
    )
}
export default createCharityPage; 