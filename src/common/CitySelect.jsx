import React, { useState, useMemo, useEffect, memo, useCallback } from 'react'
import classnames from "classnames"
import PropTypes from "prop-types";
import "./CitySelect.css";

const CityItem = memo(function CityItem (props) {
  const {
    name,
    onSelect
  } = props;
  return (
    <li className="city-li" onClick={() => onSelect(name)}>
      {name}
    </li>
  )
})

const CitySection = memo(function CitySection (props) {
  const {
    title,
    cities = [],
    onSelect
  } = props;
  return (
    <ul className="city-ul">
      <li className="city-li" key={title} data-cate={title}>
        {title}
      </li>
      {
        cities.map(city => {
          return (
            <CityItem
              key={city.name}
              name={city.name}
              onSelect={onSelect}
            />
          )
        })
      }
    </ul>
  )
})

const CityList = memo(function CityList (props) {
  const {
    sections,
    onSelect,
    toAlpha
  } = props

  return (
    <div className="city-list">
      <div className="city-cate">
        {
          sections.map(section => {
            return (
              <CitySection
                title={section.title}
                cities={section.citys}
                onSelect={onSelect}
                key={section.title}
              >
              </CitySection>
            );
          })
        }
      </div>
      <div className="city-index">
        {
          alphabet.map(alpha => {
            return <AlphaIndex key={alpha} alpha={alpha} onClick={toAlpha} />
          })
        }
      </div>
    </div>
  )
})

const SuggestItem = memo(function SuggestItem (props) {
  const {
    name,
    onClick
  } = props
  return (
    <li
      className="city-suggest-li"
      onClick={() => onClick(name)}
    >
      {name}
    </li>
  )
})

const Suggest = memo(function Suggest (props) {
  const {
    searchKey,
    onSelect
  } = props

  const [result, setResult] = useState([]);

  useEffect(() => {
    fetch("/rest/search?key=" + encodeURIComponent(searchKey))
      .then(res => res.json())
      .then(data => {
        console.log(data);
        const {
          result,
          searchKey: sKey
        } = data;

        if (sKey === searchKey) {
          setResult(result)
        }
      })
  }, [searchKey])

  const fallBackResult = useMemo(() => {
    if (!result.length) {
      return [
        { display: searchKey }
      ]
    }
    return result
  }, [result, searchKey])
  console.log(result)
  return (
    <div className="city-suggest">
      <ul className="city-suggest-ul">
        {
          fallBackResult.map(item => {
            return (
              <SuggestItem
                key={item.display}
                name={item.display}
                onClick={onSelect}
              ></SuggestItem>
            );
          })
        }
      </ul>
    </div>
  )

})

const AlphaIndex = memo(function AlphaIndex (props) {
  const { alpha, onClick } = props;
  return (
    <i className="city-index-item" onClick={() => onClick(alpha)}>
      {alpha}
    </i>
  )
})

const alphabet = Array.from(new Array(26), (ele, index) => {
  return String.fromCharCode(65 + index);
})



const CitySelector = memo(function CitySelector (props) {
  const { show, cityData, isLoading, onBack, fetchCityData, onSelect } = props;
  const [searchkey, setSearchKey] = useState("");
  const key = useMemo(() => searchkey.trim(), [searchkey]);
  useEffect(() => {
    if (!show || cityData || isLoading) {
      return;
    }
    console.log("sss")
    fetchCityData();
  }, [show, cityData, isLoading, fetchCityData])

  const toAlpha = useCallback(
    alpha => {
      document.querySelector(`[data-cate='${alpha}']`).scrollIntoView();
    }
    , [])

  const outputCitySections = () => {
    if (isLoading) {
      return <div>loading</div>
    }
    if (cityData) {
      return (
        <CityList
          sections={cityData.cityList}
          onSelect={onSelect}
          toAlpha={toAlpha}
        />
      )
    }
    return <div>error</div>
  }

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
      {
        Boolean(key) && (
          <Suggest
            searchKey={key}
            onSelect={key => onSelect(key)}
          />
          // fallBackResult
        )
      }
      {outputCitySections()}
    </div>
  )
})
CitySelector.propTypes = {
  show: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  fetchCityData: PropTypes.func.isRequired
}
export default CitySelector;
// 8-7