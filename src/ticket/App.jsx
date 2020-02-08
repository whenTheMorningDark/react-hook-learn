import React, {
  useEffect, useCallback, useMemo, lazy, Suspense
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
// import Schedule from "./Schedule"
import useNav from "../common/useNav";
import { bindActionCreators } from "redux"
import { TrainContext } from "./context"
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
  setTickets,

  toggleIsScheduleVisible
} from "./actions"

const Schedule = lazy(() => import("./Schedule"))

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
    dispatch
    // toggleIsScheduleVisible
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

  const detailCbs = useMemo(() => {
    return bindActionCreators({
      toggleIsScheduleVisible
    }, dispatch)
  }, [dispatch])


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
        <div className="detail-wrapper" style={{ paddingTop: 50 + 'px' }}>
          <Detail
            departDate={departDate}
            arriveDate={arriveDate}
            departTimeStr={departTimeStr}
            arriveTimeStr={arriveTimeStr}
            trainNumber={trainNumber}
            departStation={departStation}
            arriveStation={arriveStation}
            durationStr={durationStr}
            {
            ...detailCbs
            }
          />
        </div>
        <TrainContext.Provider value={{ trainNumber, departStation, arriveStation, departDate }}>
          <Candidate tickets={tickets}></Candidate>
        </TrainContext.Provider>
        {
          isScheduleVisible && <div className="mask" onClick={() => dispatch(toggleIsScheduleVisible())}>
            <Suspense fallback={<div>loading</div>}>
              <Schedule
                date={departDate}
                trainNumber={trainNumber}
                departStation={departStation}
                arriveStation={arriveStation}
              />
            </Suspense>
          </div>
        }
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