
function donorDashboard(props) {
  return (
    <div>
      <h1>Donor Dashboard</h1>
      <h2>Your Name: {props.state.name}</h2>
      <h2>Total Reward Tokens: {props.state.token}</h2>
      <h2>Total Donations: {props.state.totalDonations}</h2>
      <h2>Activation Status: {props.state.activationStatus && <h4>Active</h4>}</h2>
    </div>
  );
}
export default donorDashboard;