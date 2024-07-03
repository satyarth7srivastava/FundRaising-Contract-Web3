

function loginPage({ connectWallet, accTypeDonor, accTypeCharity, accTypeCreateDonor, accTypeCreateCharity, accTypeOwner }) {
    return (
        <div className="login_container">
            <div className="blurBox">
                <label className="connectLabel">Enter Operation</label>
                <select id="accType" className="inputBox">
                    <option value="Donor">Donor</option>
                    <option value="Charity">Charity</option>
                    <option value="Create_Donor">Create Donor</option>
                    <option value="Create_Charity">Create Charity</option>
                    <option value="Owner">Owner</option>
                </select>
                <button className="GoBtn" onClick={async () => {
                    await connectWallet();
                    if (document.getElementById('accType').value === "Donor") {
                        accTypeDonor();
                    } else if (document.getElementById('accType').value === "Charity") {
                        accTypeCharity();
                    } else if (document.getElementById('accType').value === "Create_Donor") {
                        accTypeCreateDonor();
                    }
                    else if (document.getElementById('accType').value === "Create_Charity") {
                        accTypeCreateCharity();
                    } else if (document.getElementById('accType').value === "Owner") {
                        accTypeOwner();
                    }

                }}>Go</button>
            </div>
        </div>
    )

}
export default loginPage;
