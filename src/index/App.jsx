import React from 'react'

import "./App.css";
import { connect } from "react-redux";
import Header from "../common/Header";
import DepartDate from "./DepartDate"
import HighSpeed from "./HighSpeed"
import Journey from "./Journey"
import Submit from "./Submit"
function App (props) {
  return (
    <div>
      <Header></Header>
      <Journey></Journey>
      <DepartDate></DepartDate>
      <HighSpeed></HighSpeed>
      <Submit></Submit>
    </div>
  );
}
export default connect(
  function mapStateToProps (state) {
    return {}
  },
  function mapDispatchToProps (dispatch) {
    return {}
  }
)(App);