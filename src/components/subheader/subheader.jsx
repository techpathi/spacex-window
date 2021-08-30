import React, { useEffect } from "react";
import "../main/main.scss";
import { Select } from "antd";
import { FilterOutlined, CalendarOutlined } from "@ant-design/icons";

const Option = { Select };

export default function SubHeader({
  LaunchFilterChange,
  CalendarFilterChange,
  launchFilterFromURL,
  calendarFilterFromURL,
}) {
  const [launchFilter, setLaunchFilter] = React.useState(null);
  const [calendarFilter, setCalendarFilter] = React.useState(null);

  useEffect(() => {
    launchFilterFromURL !== undefined && onLaunchSelect(launchFilterFromURL);
  }, [launchFilterFromURL]);

  useEffect(() => {
    calendarFilterFromURL !== undefined &&
      onCalendarSelect(calendarFilterFromURL);
  }, [calendarFilterFromURL]);

  const onLaunchSelect = (value) => {
    setLaunchFilter(value);
  };

  const onCalendarSelect = (value) => {
    setCalendarFilter(value);
  };

  useEffect(() => {
    LaunchFilterChange(launchFilter);
  }, [launchFilter]);

  useEffect(() => {
    CalendarFilterChange(calendarFilter);
  }, [calendarFilter]);

  return (
    <div className="subheader-container">
      <div className="calendar-filter-row">
        <CalendarOutlined className="filter-icon" />
        <Select
          size={"middle"}
          onChange={onCalendarSelect}
          className="calendar-filter-select"
          bordered={false}
          placeholder={"Filter by date"}
          defaultValue={"none"}
          value={calendarFilter}
        >
          <Option value={"none"}>None</Option>
          <Option value={"pastweek"}>Past week</Option>
          <Option value={"pastmonth"}>Past month</Option>
          <Option value={"past3months"}>Past 3 months</Option>
          <Option value={"past6months"}>Past 6 months</Option>
          <Option value={"pastyear"}>Past year</Option>
          <Option value={"past2years"}>Past 2 years</Option>
          <Option value={"custom"}>Custom date</Option>
        </Select>
      </div>
      <div className="launch-filter-row">
        <FilterOutlined className="filter-icon" />
        <Select
          size={"middle"}
          onChange={onLaunchSelect}
          className="launch-filter-select"
          defaultValue={"all"}
          bordered={false}
          placeholder={"Filter by launch status"}
          value={launchFilter}
        >
          <Option value={"all"}>All Launches</Option>
          <Option value={"upcoming"}>Upcoming Launches</Option>
          <Option value={"successful"}>Successful Launches</Option>
          <Option value={"failed"}>Failed Launches</Option>
        </Select>
      </div>
    </div>
  );
}
