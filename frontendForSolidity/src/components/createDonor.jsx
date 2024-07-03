function createDonorPage({createDonor}){
    function create(){
        var name = document.getElementById("name").value;
        createDonor(name);
    }
    return(
        <div>
            <label className="connectLabel">Enter your name</label>
            <input type="text" id="name" className="inputBox"></input>
            <button className="GoBtn" onClick={()=>create()}>Confirm</button>
        </div>
    )
}
export default createDonorPage; 