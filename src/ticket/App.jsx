import React, {
  useEffect, useCallback
} from 'react'
import "./App.css";
import URI from "urijs"
import dayjs from "dayjs"
import { h0 } from "../common/fp"
import { connect } from "react-redux";
import Header from "../common/Header";
import Nav from "../common/Nav"
import Detail from "../common/Detail";
import Candidate from "./Candidate"
import Schedule from "./Schedule"
import useNav from "../common/useNav"
// dispatch(setArriveTimeStr(arriveTimeStr));
//         dispatch(setArriveDate(arriveDate));
//         dispatch(setDurationStr(durationStr));
//         dispatch(setTickets(candidates));
import {
  setDepartStation,
  setArriveStation,
  setTrainNumber,
  setDepartDate,
  prevDate,
  nextDate,
  setSearchParsed,
  setDepartTimeStr,
  setArriveTimeStr,
  setArriveDate,
  setDurationStr,
  setTickets
} from "./actions"
function App (props) {
  const {
    departDate,
    arriveDate,
    departTimeStr,
    arriveTimeStr,
    departStation,
    arriveStation,
    trainNumber,
    durationStr,
    tickets,
    isScheduleVisible,
    searchParsed,
    dispatch,
  } = props;

  const onBack = useCallback(() => {
    window.history.back();
  }, [])

  useEffect(() => {
    const queries = URI.parseQuery(window.location.search);

    const {
      aStation,
      dStation,
      trainNumber,
      date
    } = queries
    dispatch(setDepartStation(dStation))
    dispatch(setArriveStation(aStation))
    dispatch(setTrainNumber(trainNumber))
    dispatch(setDepartDate(h0(dayjs(date).valueOf())))
    dispatch(setSearchParsed(true));
  }, [dispatch])
  const {
    isPrevDisabled,
    isNextDisabled,
    prev,
    next
  } = useNav(departDate, dispatch, prevDate, nextDate)

  useEffect(() => {
    document.title = trainNumber
  }, [trainNumber])

  useEffect(() => {
    if (!searchParsed) {
      return;
    }

    const url = new URI("/rest/ticket")
      .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
      .setSearch('trainNumber', trainNumber)
      .toString();
    fetch(url)
      .then(response => response.json())
      .then(result => {
        const { detail, candidates } = result;

        const {
          departTimeStr,
          arriveTimeStr,
          arriveDate,
          durationStr,
        } = detail;
        // 10-3
        dispatch(setDepartTimeStr(departTimeStr));
        dispatch(setArriveTimeStr(arriveTimeStr));
        dispatch(setArriveDate(arriveDate));
        dispatch(setDurationStr(durationStr));
        dispatch(setTickets(candidates));
      });

  }, [departDate, dispatch, searchParsed, trainNumber])

  if (!searchParsed) {
    return null;
  }

  return (
    <div className="app">
      <div className="header-wrapper">
        <Header title={trainNumber} onBack={onBack} />
        <div className="nav-wrapper">
          <Nav
            date={departDate}
            isPrevDisabled={isPrevDisabled}
            isNextDisabled={isNextDisabled}
            prev={prev}
            next={next}
          />
        </div>
      </div>
    </div>
  )
}
export default connect(
  function mapStateToProps (state) {
    return state
  },
  function mapDispatchToProps (dispatch) {
    return {
      dispatch
    }
  }
)(App);