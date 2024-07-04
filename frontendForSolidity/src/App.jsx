import NavBar from './components/NavBar'
import LoginPage from './components/loginPage'
import { ethers } from "ethers";
import React from 'react';
import Loading from './components/loading';
import DonorDash from './components/donorDashboard';
import ListForDonations from './components/listForDonations';
import DonationPage from './components/donationPage';
import CreateDonor from './components/createDonor';
import CreateCharity from './components/createCharity';

import TokenArtifact from "./contracts/DonationForGood.json";
import contractAddress from "./contracts/contract-address.json";




export class App extends React.Component {

  constructor(props) {
    super(props)
    this.initialState = {
      connection: false,
      selectedAddress: undefined,
      owner: undefined,
      balance: undefined,
      type: undefined,
      dataGot: false,
      name: "",
      token: undefined,
      totalDonations: "",
      activationStatus: undefined,
      showCharityLisst: false,
      showDonationPage: false,
      donateToAddress: undefined,
      donationAmount: undefined,
      charityData: [],

    }
    this.state = this.initialState

  }
  render() {
    if (window.ethereum === undefined) {
      return (<h1>No Wallet</h1>);
    }
    if (!this.state.connection) {
      return (
        <div>
          <LoginPage connectWallet={() => this._connectWallet()} accTypeDonor={() => this._accTypeDonor()} accTypeCharity={() => this._accTypeCharity()} accTypeCreateDonor={() => this._accTypeCreateDonor()} accTypeCreateCharity={() => this._accTypeCreateCharity()} accTypeOwner={() => this._accTypeOwner()} />
        </div>
      );
    }

    if (this.state.type === "Donor" && !this.state.showCharityLisst && !this.state.showDonationPage) {
      if (!this.state.dataGot) {
        this._getDonorData().then((Data) => {
          this.setState({ name: Data[1], token: ethers.utils.formatEther(Data[2]), totalDonations: ethers.utils.formatEther(Data[2]), activationStatus: Data[4] });
        });
      }
      if (this.state.name === "") {
        return (
          <div className="blurBox">
            <h2>Plz Create A Donor Account First</h2>
          </div>
        )
      }
      return (
        <div className="blurBox">
          <DonorDash state={this.state} />
          <button className="GoBtn" onClick={() => this.setState({ showCharityLisst: true })}>Get List of Available Charities</button>
        </div>
      )
    } else if (this.state.type === "Donor" && this.state.showCharityLisst && !this.state.showDonationPage) {
      this._listFunc();
      if (this.state.charityData.length === 0) {
        return <Loading />
      }
      var obj = this.state.charityData.map((data) => {
        if (data[5]) {
          return (
            <li className='myLists'>
              <h2>{data[1]}</h2>
              <h3>{data[2]}</h3>
              <h3>{ethers.utils.formatEther(data[4])} donated of {ethers.utils.formatEther(data[3])}</h3>
              <button className="GoBtn" onClick={() => this.setState({ showDonationPage: true, donateToAddress: data[0] })}>Donate</button>
            </li>
          );
        } else {
          return (
            <div>

            </div>
          )
        }
      })
      return (
        <div className="blurBox">
          <NavBar />
          <ol>
            {obj}
          </ol>
        </div>
      )
    } else if (this.state.type === "Charity") {
      this._getCharityData(this.state.selectedAddress).then(async (data) => {
        const obj = await Promise.all(data);
        this.setState({ charityData: obj });
        this.setState({ goal: ethers.utils.formatEther(obj[3]) });
        this.setState({ amount: ethers.utils.formatEther(obj[4]) });
      });
      return (
        <div className="blurBox">
          <NavBar />
          <h1>Charity</h1>
          <h1>{this.state.charityData[1]}</h1>
          <h2>{this.state.charityData[2]}</h2>
          <h3>{this.state.amount} donated of {this.state.goal}</h3>
          <button className="GoBtn" onClick={() => this._checkOut()}>Check Out</button>
        </div>
      )
    } else if (this.state.showDonationPage && this.state.type === "Donor") {
      return (
        <div className="blurBox">
          <h1>Donation Page</h1>
          <label className="connectLabel">Enter the amount you want to donate in eth</label>
          <input className="inputBox" type="text" id="donationAmount"></input>
          <button className="GoBtn" onClick={() => { this._donateTo(document.getElementById("donationAmount").value, this.state.donateToAddress); this.setState({ showDonationPage: false, showCharityLisst: false }); this._resetState(); this._stopPollingData() }}>Donate</button>
        </div>
      )
    } else if (this.state.type === "Create_Donor") {
      return (
        <div>
          <div className="blurBox">
            <h1>Create Donor</h1>
            <CreateDonor createDonor={(name) => this._createDonor(name)} />
          </div>

        </div>
      )
    } else if (this.state.type === "Create_Charity") {
      return (
        <div className="blurBox">
          <NavBar />
          <h1>Create Charity</h1>
          <CreateCharity createChar={(name, amount, cause, autoCheckout) => this._createCharity(name, amount, cause, autoCheckout)} />
        </div>
      )
    } else if (this.state.type === "Owner" && !this.state.showCharityLisst) {
      this._getOwner();
      if (this.state.selectedAddress === this.state.owner) {
        return (
          <div className="blurBox">
            <NavBar />
            <h1>Welcome Sir</h1>
            <button className="GoBtn" onClick={() => this.setState({ showCharityLisst: true })}>Get List of Available Charities</button>
          </div>
        )
      } else {
        return (
          <div>
            <NavBar />
            <h1>Not Owner</h1>
          </div>
        )
      }
    } else if (this.state.type === "Owner" && this.state.showCharityLisst) {
      this._listFunc();
      if (this.state.charityData.length === 0) {
        return <Loading />
      }
      var obj = this.state.charityData.map((data) => {
        return (
          <li>
            <h1>{data[1]}</h1>
            <h2>Activation Status: {
              data[5] ? "Active" : "Inactive"
            }
            </h2>
            <h2>{data[2]}</h2>
            <h3>{ethers.utils.formatEther(data[4])} donated of {ethers.utils.formatEther(data[3])}</h3>
            <button className="GoBtn" onClick={() => this._activateCharity(data[0])}>Activate</button>
            <button className="GoBtn" onClick={() => this._deActivateCharity(data[0])}>DeActivate</button>
          </li>
        );
      })
      return (
        <div>
          <NavBar />
          <ol className='myLists'>
            {obj}
          </ol>
        </div>
      )
    }
  }



  // All Are functions

  async _accTypeDonor() {
    await this.setState({ type: "Donor" });
    console.log(this.state.type);
  }
  async _accTypeCharity() {
    this.setState({ type: "Charity" });
  }
  async _accTypeOwner() {
    this.setState({ type: "Owner" });
    console.log(this.state.type);
  }
  async _accTypeCreateDonor() {
    this.setState({ type: "Create_Donor" });
  }
  async _accTypeCreateCharity() {
    this.setState({ type: "Create_Charity" });
  }



  async _connectWallet() {
    const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    // window.ethereum.on("accountsChanged", ([newAddress]) => {
    //   this.setState({ connection: false });
    //   this._stopPollingData();
    //   // `accountsChanged` event can be triggered with an undefined newAddress.
    //   // This happens when the user removes the Dapp from the "Connected
    //   // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
    //   // To avoid errors, we reset the dapp state 
    //   if (newAddress === undefined) {
    //     return this._resetState();
    //   }
    //   this._initialize(newAddress);
    // });
  }
  async _updateBalance() {
    const balance = await this._provider.getBalance(this.state.selectedAddress);
    this.setState({ balance: ethers.utils.formatEther(balance) });
  }
  _initialize(userAddress) {
    // This method initializes the dapp
    userAddress = userAddress.toLowerCase();
    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.
    this._initializeEthers();
    // this._startPollingData();
    this._updateBalance();
    this.setState({ connection: true });
  }
  async _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);
    // Then, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._myContract = new ethers.Contract(
      contractAddress.Address,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );

  }
  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 100);

    // We run it once immediately so we don't have to wait for it
    this._updateBalance();
  }
  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }
  _resetState() {
    this.setState(this.initialState);
  }
  async _getDonorData() {
    let data = await this._myContract.getDetailsDonor(this.state.selectedAddress);
    this.setState({ dataGot: true });
    return data;
  }
  async _listFunc() {
    let data = await this._myContract.getRecieverList();
    this.setState({ list: data });
    const list = await this.state.list.map(async (address) => {
      let obj = await this._getCharityData(address);
      return obj;
    })
    const listWait = await Promise.all(list);
    this.setState({ charityData: listWait });
  }
  async _getCharityData(address) {
    let data = await this._myContract.getDetailsReciever(address);
    return data;
  }
  async _donateTo(amount, address) {
    const _ETH = ethers.utils.parseEther(amount);
    await this._myContract.donateTo(address, { value: _ETH });
  }
  async _createDonor(name) {
    await this._myContract.createDonorAcc(name);
    this._resetState();
  }
  async _checkOut() {
    this._myContract.checkOut();
  }
  async _createCharity(name, amount, cause, autoCheckout) {
    await this._myContract.createRecieverAcc(name, amount, cause, autoCheckout);
    this._resetState();
  }
  async _getOwner() {
    var ownerAdd = await this._myContract.getOwner();
    ownerAdd = ownerAdd.toLowerCase();
    this.setState({ owner: ownerAdd });

  }
  async _activateCharity(address) {
    await this._myContract.activateRecieverAcc(address);
    this._resetState();
  }
  async _deActivateCharity(address) {
    await this._myContract.deactivateRecieverAcc(address);
    this._resetState();
  }
  async _activateDonor(address) {
    await this._myContract.activateDonorAcc(address);
  }
  async _deActivateDonor(address) {
    await this._myContract.deactivateDonorAcc(address);
  }
}

