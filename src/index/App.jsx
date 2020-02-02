import React, { useCallback, useMemo } from 'react'
import { bindActionCreators } from "redux"
import "./App.css";
import { connect } from "react-redux";
import Header from "../common/Header";
import DepartDate from "./DepartDate"
import HighSpeed from "./HighSpeed"
import Journey from "./Journey"
import Submit from "./Submit"
import CitySelect from "../common/CitySelect";
import {
  exchangeFromTo,
  showCitySelector,
  hideCitySelector,
  fetchCityData
} from "./actions"
function App (props) {
  const { from, to, dispatch, isCitySelectorVisible, cityData, isLoadingCityData } = props;
  const onBack = useCallback(() => {
    window.history.back();
  }, []);
  const cbs = useMemo(() => {
    return bindActionCreators({
      exchangeFromTo,
      showCitySelector
    }, dispatch)
  }, [dispatch])
  //   const citySelectorCbs = useMemo(() => {
  //     return bindActionCreators(
  //         {
  //             onBack: hideCitySelector,
  //             fetchCityData,
  //             onSelect: setSelectedCity,
  //         },
  //         dispatch
  //     );
  // }, []);
  const citySelectorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideCitySelector,
      fetchCityData
    }, dispatch)
  }, [dispatch]);
  return (
    <div>
      <div className="header-wrapper">
        <Header title="火车票" onBack={onBack}></Header>
      </div>
      <form className="form">
        <Journey
          from={from}
          to={to}
          {...cbs}
        ></Journey>
        <DepartDate></DepartDate>
        <HighSpeed></HighSpeed>
        <Submit></Submit>
      </form>
      {/* isCitySelectorVisible,cityData,isLoadingCityData */}
      <CitySelect
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...citySelectorCbs}
      ></CitySelect>
    </div>
  );
}
export default connect(
  function mapStateToProps (state) {
    return state;
  },
  function mapDispatchToProps (dispatch) {
    return { dispatch }
  }
)(App);