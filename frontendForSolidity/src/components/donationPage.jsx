function donationPage({adress,donateTofunction}){
    function donate(){
        let donationAmount = document.getElementById("donationAmount").value;
        donateTofunction(adress,donationAmount);
    }
    return(
        <div>
            <h1>Donation Page</h1>
            <label>Enter the amount you want to donate in weth</label>
            <input type="text" id="donationAmount"></input>
            <button onClick={donate()}>Donate</button>
        </div>
    )
}
export default donationPage;