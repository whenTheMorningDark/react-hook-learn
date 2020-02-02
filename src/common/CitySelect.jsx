import React, { useState, useMemo, useEffect } from 'react'
import classnames from "classnames"
import PropTypes from "prop-types";
import "./CitySelect.css";
export default function CitySelector (props) {
  const { show, cityData, isLoading, onBack, fetchCityData } = props;
  const [searchkey, setSearchKey] = useState("");
  const key = useMemo(() => searchkey.trim(), [searchkey]);
  useEffect(() => {
    if (!show || cityData || isLoading) {
      return;
    }
    console.log("sss")
    fetchCityData();
  }, [show, cityData, isLoading, fetchCityData])

  return (
    <div className={classnames("city-selector", { hidden: !show })}>
      <div className="city-search">
        <div className="search-back" onClick={() => onBack()}>
          <svg width="42" height="42">
            <polyline
              points="25,13 16,21 25,29"
              stroke="#fff"
              strokeWidth="2"
              fill="none"
            ></polyline>
          </svg>
        </div>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={key}
            className="search-input"
            placeholder="城市车站中文或拼音"
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <i className={classnames("search-clean", { hidden: key.length === 0 })} onClick={() => setSearchKey("")}>
          &#xf063;
        </i>
      </div>
    </div>
  )
}
CitySelector.propTypes = {
  show: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  fetchCityData: PropTypes.func.isRequired
}
