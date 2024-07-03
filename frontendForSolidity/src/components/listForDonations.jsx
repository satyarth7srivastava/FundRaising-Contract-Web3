function listForDonation({addressList,getter}){
    const dataOfDonation = {addressList}.map((address) => {
        return getter(address); //getter is a function that takes address as input and returns the data of the donation
    });
    console.log(dataOfDonation);
    return (
        <div>
            <h1>Donation List</h1>
            <ul>
                
            </ul>
        </div>
    );
}
export default listForDonation;