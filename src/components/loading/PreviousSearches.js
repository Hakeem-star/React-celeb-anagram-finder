import React, { useContext, useEffect, useRef } from "react";
import { Popover, Button, Row, Col } from "antd";
import { AppContext } from "./../../App";
import useURLSharedSearch from "./../../utils/useURLSharedSearch";

export default function PreviousSearches() {
  const {
    setInputvalueState,
    updateActiveHistoryButtonStatus,
    setTableData,
    previousSearchesData,
    setCurrentSearch,
  } = useContext(AppContext);
  const search = useURLSharedSearch();

  if (previousSearchesData.length < 1) {
    return <div></div>;
  }

  return (
    <div className="previous-searches">
      {previousSearchesData.map((result, index, original) => {
        let correctIndex = original.length - index - 1;
        const trailingDots = result.value.length > 7 ? "..." : "";
        const name = `${result.value.substr(0, 8)}${trailingDots}`;

        return (
          <Row key={`${result.title}${correctIndex}`}>
            <Col
              span={12}
              push={6}
              className={`previous-searches__item result-${correctIndex}`}
            >
              <Popover
                placement="right"
                content={
                  <div>
                    <div>{result.value}</div>
                    <div>Share</div>
                  </div>
                }
                title={result.title}
              >
                <Button
                  onClick={() => {
                    updateActiveHistoryButtonStatus(correctIndex);
                    console.log(result);
                    if (result.tableData !== undefined) {
                      setTableData(result.tableData);
                    } else {
                      console.log("CLICK");
                      search(result.value, result.anagramType);
                    }
                    setInputvalueState(() => result.value);
                  }}
                  style={{ width: "100%" }}
                  type="primary"
                >
                  {name}
                </Button>
              </Popover>
            </Col>
          </Row>
        );
      })}
    </div>
  );
}
