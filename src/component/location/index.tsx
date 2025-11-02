import { Map } from "./map"
import CarIcon from "../../icons/car-icon.svg?react"
import BusIcon from "../../icons/bus-icon.svg?react"
import { LazyDiv } from "../lazyDiv"
import { LOCATION, LOCATION_ADDRESS } from "../../const"

export const Location = () => {
  return (
    <>
      <LazyDiv className="card location">
        <h2 className="english">Location</h2>
        <div className="addr">
          {LOCATION}
          <div className="detail">{LOCATION_ADDRESS}</div>
        </div>
        <Map />
      </LazyDiv>
      <LazyDiv className="card location">
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <BusIcon className="transportation-icon" />
          </div>
          <div className="heading">대중교통</div>
          <div />
          <div className="content">
            * 지하철 이용시
            <br />
            [마포역] 3번출구 200m 도보 2분 (5호선)
            <br />
            [공덕역] 8,9번출구 400m 도보 5분 (5호선, 6호선, 공항철도, 경의중앙선)
          </div>
        </div>
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <CarIcon className="transportation-icon" />
          </div>
          <div className="heading">자가용</div>
          <div />
          <div className="content">
            * 주차안내
            <br />
            - 주차는 최대 3시간 무료입니다.
            <br />
            - 호텔 지하 주차장 만차 시 호텔 타워주차장(지상 1층) 이용 가능합니다.
            <br />
            <br />
            <b>※ 호텔 타워주차장(지상 1층) 이용 시 발렛비가 별도로 발생합니다.</b>
            <br />
            <b>※ 주말에는 주차 혼잡이 예상되오니, 가능하시면 대중교통 이용을 부탁드립니다.</b>
            <br />
          </div>
        </div>
      </LazyDiv>
    </>
  )
}
