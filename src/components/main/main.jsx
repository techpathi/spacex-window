import React from "react";
import "./main.scss";
import SubHeader from "../subheader/subheader";
import LaunchTable from "../table/launchtable";
import { ShareAltOutlined } from "@ant-design/icons";
import { message } from "antd";

export default function Main() {
  const [launchFilter, setLaunchFilter] = React.useState(null);
  const [calendarFilter, setCalendarFilter] = React.useState(null);

  const onLaunchFilterChange = (filter) => {
    setLaunchFilter(filter);
  };

  const onCalendarFilterChange = (filter) => {
    setCalendarFilter(filter);
  };

  const onFilterUpdateFromURL = (launchFilter, calendarFilter) => {
    setLaunchFilter(launchFilter);
    setCalendarFilter(calendarFilter);
  };

  const copyURLToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success({
      content: "URL copied! Share with a friend to show them this page!!",
      style: { position: "fixed", bottom: "3rem", right: "7rem" },
    });
  };

  return (
    <div className="main-container">
      <SubHeader
        LaunchFilterChange={onLaunchFilterChange}
        CalendarFilterChange={onCalendarFilterChange}
        launchFilterFromURL={launchFilter}
        calendarFilterFromURL={calendarFilter}
      />
      <LaunchTable
        selectedLaunchFilter={launchFilter}
        selectedCalendarFilter={calendarFilter}
        onFilterUpdateFromURL={onFilterUpdateFromURL}
      />
      <div className="share-url-fab">
        <ShareAltOutlined className="share-icon" onClick={copyURLToClipboard} />
      </div>
    </div>
  );
}
