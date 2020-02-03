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
import DateSelect from "../common/DateSelect";
import { h0 } from "../common/fp"
import {
  exchangeFromTo,
  showCitySelector,
  hideCitySelector,
  fetchCityData,
  setSelectedCity,
  showDateSelector,
  hideDateSelector,
  setDepartDate
} from "./actions"
function App (props) {
  const { from,
    to,
    dispatch,
    isCitySelectorVisible,
    cityData,
    isLoadingCityData,
    departDate,
    isDateSelectorVisible,
  } = props;
  const onBack = useCallback(() => {
    window.history.back();
  }, []);
  const cbs = useMemo(() => {
    return bindActionCreators({
      exchangeFromTo,
      showCitySelector
    }, dispatch)
  }, [dispatch])
  const citySelectorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideCitySelector,
      fetchCityData,
      onSelect: setSelectedCity
    }, dispatch)
  }, [dispatch]);

  const departDateCbs = useMemo(() => {
    return bindActionCreators({
      onClick: showDateSelector
    }, dispatch)
  }, [dispatch])
  const dateSelectorCbs = useMemo(() => {
    return bindActionCreators({
      onBack: hideDateSelector
    }, dispatch)
  }, [dispatch])

  const onSelectDate = useCallback((day) => {
    if (!day) {
      return;
    }
    if (day < h0()) {
      return
    }

    dispatch(setDepartDate(day));
    dispatch(hideDateSelector())

  }, [dispatch])

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
        <DepartDate time={departDate} {...departDateCbs}></DepartDate>
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
      <DateSelect show={isDateSelectorVisible} {...dateSelectorCbs} onSelect={onSelectDate}></DateSelect>
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