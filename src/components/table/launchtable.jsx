import { React, useEffect, useState } from "react";
import { Table, Tag } from "antd";
import moment from "moment";
import APICall from "../../utilities/APICall";
import "./launchtable.scss";
import CalendarFilterPicker from "../calendarfilterpicker/calendarfilterpicker";
import LaunchDetailsModal from "../launchdetailsmodal/launchdetailsmodal";
import { LoadingOutlined } from "@ant-design/icons";
import qs from "qs";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
const API_URL = "https://api.spacexdata.com/v4/launches/";
const ROCKET_URL = "https://api.spacexdata.com/v4/rockets/";
const PAYLOAD_URL = "https://api.spacexdata.com/v4/payloads/";
const LAUNCHPAD_URL = "https://api.spacexdata.com/v4/launchpads/";

const columns = [
  {
    title: "No:",
    dataIndex: "launchNumber",
    key: "launchNumber",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Launched(UTC)",
    dataIndex: "launchTime",
    key: "launchTime",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Location",
    dataIndex: "location",
    key: "location",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Mission",
    dataIndex: "mission",
    key: "mission",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Orbit",
    dataIndex: "orbit",
    key: "orbit",
    render: (text) => <p>{text}</p>,
  },
  {
    title: "Launch Status",
    dataIndex: "launchStatus",
    key: "launchStatus",
    render: (launchStatus) => {
      let color;
      switch (launchStatus) {
        case "Failed":
          color = "red";
          break;
        case "Upcoming":
          color = "orange";
          break;
        default:
          color = "green";
      }
      return (
        <Tag color={color} key={launchStatus}>
          {launchStatus}
        </Tag>
      );
    },
  },
  {
    title: "Rocket",
    dataIndex: "rocket",
    key: "rocket",
    render: (text) => <p>{text}</p>,
  },
];

const generateTableData = (launchesData) => {
  let tableData = [];
  launchesData.map((launch, index) => {
    tableData.push({
      launchNumber: index + 1,
      launchTime: moment(Date.parse(launch.launch_date)).format(
        "DD MMM YYYY HH:mm"
      ),
      location: launch.launch_site,
      mission: launch.mission_name,
      orbit: launch.payload_orbit,
      launchStatus: launch.upcoming
        ? "Upcoming"
        : launch.launch_success
        ? "Success"
        : "Failed",
      rocket: launch.rocket_name,
    });
  });
  return tableData;
};

export default function LaunchTable({
  selectedLaunchFilter,
  selectedCalendarFilter,
  onFilterUpdateFromURL,
}) {
  const [launchesData, setLaunchesData] = useState([]);
  const [launchesToDisplay, setLaunchesToDisplay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [launchToModal, setLaunchToModal] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCalendarFilterVisible, setIsCalendarFilterVisible] = useState(false);
  const [rangeSelected, setRangeSelected] = useState(null);
  const [filterMatchCount, setFilterMatchCount] = useState(0);
  const [filters, setFilters] = useState({});
  const [activeLaunchFilter, setActiveLaunchFilter] = useState(null);
  const [activeCalendarFilter, setActiveCalendarFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    if (JSON.parse(localStorage.getItem("launchData")) === null) {
      let launchData = [];
      APICall(API_URL).then((launchesData) => {
        launchesData.forEach((dataItem) => {
          let {
            id: launch_id,
            flight_number,
            links: {
              article: article_link,
              webcast: webcast_link,
              wikipedia: wikipedia_link,
              patch: { small: mission_patch_small },
            },
            name,
            details: description,
            rocket: rocket_id,
            success: launch_success,
            payloads: payload_ids,
            date_utc: launch_date,
            launchpad: launchpad_id,
            upcoming: upcoming,
          } = dataItem;

          let rocketName,
            rocketType,
            rocketCompany,
            rocketCountry,
            orbit,
            payloadType,
            launchSite;

          APICall(`${ROCKET_URL}${rocket_id}`).then((rocketData) => {
            rocketName = rocketData.name;
            rocketType = `${rocketData.engines.type} ${
              rocketData.engines.version ? rocketData.engines.version : ""
            }`;
            rocketCompany = rocketData.company;
            rocketCountry = rocketData.country;
            return APICall(`${PAYLOAD_URL}${payload_ids[0]}`).then(
              (payloadData) => {
                orbit = payloadData.orbit;
                payloadType = payloadData.type;
                return APICall(`${LAUNCHPAD_URL}${launchpad_id}`).then(
                  (launchpadData) => {
                    launchSite = launchpadData.full_name;
                    let launchItem = {
                      id: launch_id,
                      flight_number: flight_number,
                      upcoming: upcoming,
                      mission_patch: mission_patch_small,
                      mission_name: name,
                      launch_success: launch_success,
                      article_link: article_link,
                      wikipedia_link: wikipedia_link,
                      webcast_link: webcast_link,
                      mission_description: description,
                      rocket_name: rocketName,
                      rocket_type: rocketType,
                      rocket_company: rocketCompany,
                      rocket_country: rocketCountry,
                      launch_date: launch_date,
                      payload_orbit: orbit,
                      payload_type: payloadType,
                      launch_site: launchSite,
                    };
                    launchData.push(launchItem);
                  }
                );
              }
            );
          });
        });

        setTimeout(() => {
          setLaunchesData(launchData);
          localStorage.setItem("launchData", JSON.stringify(launchData));
          setLaunchesToDisplay(launchData);
          setLoading(false);
        }, 3000);
      });
    } else {
      let localData = JSON.parse(localStorage.getItem("launchData"));
      setLaunchesData(localData);
      localStorage.setItem("launchData", JSON.stringify(localData));
      setLaunchesToDisplay(localData);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const filterParams = history.location.search.split("?")[1];
    const filtersFromParams = qs.parse(filterParams, { comma: true });

    setActiveCalendarFilter(filtersFromParams["calendarFilter"]);
    setActiveLaunchFilter(filtersFromParams["launchFilter"]);

    setCurrentPage(
      filtersFromParams["page"] === undefined ? 1 : filtersFromParams["page"]
    );

    setFilters({
      ["launchFilter"]: filtersFromParams["launchFilter"],
      ["calendarFilter"]: filtersFromParams["calendarFilter"],
    });

    onFilterUpdateFromURL(
      filtersFromParams["launchFilter"],
      filtersFromParams["calendarFilter"]
    );
  }, [history]);

  useEffect(() => {
    if (
      activeCalendarFilter !== null &&
      activeLaunchFilter != null &&
      selectedCalendarFilter !== null &&
      selectedLaunchFilter !== null
    ) {
      setActiveCalendarFilter(selectedCalendarFilter);
      setActiveLaunchFilter(selectedLaunchFilter);
      setFilters({
        ...filters,
        ["launchFilter"]: selectedLaunchFilter,
        ["calendarFilter"]: selectedCalendarFilter,
      });
    }
  }, [selectedCalendarFilter, selectedLaunchFilter]);

  useEffect(() => {
    let filteredLaunches = filterByDates(launchesData, activeCalendarFilter);
    setLaunchesToDisplay(filterByLaunch(filteredLaunches, activeLaunchFilter));
  }, [activeLaunchFilter, activeCalendarFilter]);

  useEffect(() => {
    if (activeLaunchFilter !== null && selectedLaunchFilter !== null) {
      setActiveLaunchFilter(selectedLaunchFilter);
      setFilters({ ...filters, ["launchFilter"]: selectedLaunchFilter });
    }
  }, [selectedLaunchFilter]);

  useEffect(() => {
    activeCalendarFilter === null &&
      setLaunchesToDisplay(filterByLaunch(launchesData, activeLaunchFilter));
  }, [activeLaunchFilter]);

  useEffect(() => {
    if (activeCalendarFilter !== null && selectedCalendarFilter !== null) {
      setFilters({ ...filters, ["calendarFilter"]: selectedCalendarFilter });
      selectedCalendarFilter === "custom" && setIsCalendarFilterVisible(true);
    }
  }, [selectedCalendarFilter]);

  useEffect(() => {
    activeLaunchFilter === null &&
      setLaunchesToDisplay(filterByDates(launchesData, activeCalendarFilter));
    if (
      activeCalendarFilter === "custom" &&
      JSON.parse(localStorage.getItem("customDates")) !== null
    ) {
      setRangeSelected(JSON.parse(localStorage.getItem("customDates")));
    }
  }, [activeCalendarFilter]);

  useEffect(() => {
    if (rangeSelected !== null) {
      localStorage.setItem("customDates", JSON.stringify(rangeSelected));
      if (activeLaunchFilter !== null) {
        let filteredLaunches = filterByLaunch(launchesData, activeLaunchFilter);
        setLaunchesToDisplay(
          filteredLaunches.filter(
            (launch) =>
              launch.launch_date >= rangeSelected.start &&
              launch.launch_date <= rangeSelected.end
          )
        );
      } else {
        setLaunchesToDisplay(
          launchesData.filter(
            (launch) =>
              launch.launch_date >= rangeSelected.start &&
              launch.launch_date <= rangeSelected.end
          )
        );
      }
    }
  }, [rangeSelected]);

  useEffect(() => {
    setFilterMatchCount(launchesToDisplay.length);
  }, [launchesToDisplay]);

  useEffect(() => {
    setActiveCalendarFilter(filters["launchFilter"]);
    setActiveCalendarFilter(filters["calendarFilter"]);
    syncFiltersWithURL();
  }, [filters]);

  useEffect(() => {
    syncFiltersWithURL();
  }, [currentPage]);

  const filterByLaunch = (launchesData, filter) => {
    let filterResults = [];
    switch (filter) {
      case "successful":
        filterResults = launchesData.filter(
          (launch) => launch.launch_success === true
        );
        break;
      case "failed":
        filterResults = launchesData.filter(
          (launch) => launch.launch_success !== true && launch.upcoming !== true
        );
        break;
      case "upcoming":
        filterResults = launchesData.filter(
          (launch) => launch.upcoming === true
        );
        break;
      default:
        filterResults = launchesData;
    }
    return filterResults;
  };

  const filterByDates = (launchesData, filter) => {
    let filterResults = [];
    switch (filter) {
      case "pastweek":
        filterResults = launchesData.filter(
          (launch) =>
            launch.launch_date >=
            moment(new Date()).subtract(1, "week").toISOString()
        );
        break;
      case "pastmonth":
        filterResults = launchesData.filter(
          (launch) =>
            launch.launch_date >=
            moment(new Date()).subtract(1, "month").toISOString()
        );
        break;
      case "past3months":
        filterResults = launchesData.filter(
          (launch) =>
            launch.launch_date >=
            moment(new Date()).subtract(3, "months").toISOString()
        );
        break;
      case "past6months":
        filterResults = launchesData.filter(
          (launch) =>
            launch.launch_date >=
            moment(new Date()).subtract(6, "months").toISOString()
        );
        break;
      case "pastyear":
        filterResults = launchesData.filter(
          (launch) =>
            launch.launch_date >=
            moment(new Date()).subtract(1, "year").toISOString()
        );
        break;
      case "past2years":
        filterResults = launchesData.filter(
          (launch) =>
            launch.launch_date >=
            moment(new Date()).subtract(2, "year").toISOString()
        );
        break;
      default:
        filterResults = launchesData;
    }

    return filterResults;
  };

  const onRangeChange = (rangeSelected) => {
    rangeSelected !== null &&
      setRangeSelected({
        start: moment(rangeSelected[0]).format("YYYY-MM-DDTHH:mm:ss"),
        end: moment(rangeSelected[1]).format("YYYY-MM-DDTHH:mm:ss"),
      });
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const syncFiltersWithURL = () => {
    let stringifiedFilterParams = qs.stringify(filters, {
      arrayFormat: "comma",
    });

    stringifiedFilterParams = `page=${currentPage}&`.concat(
      stringifiedFilterParams
    );
    stringifiedFilterParams.length > 0 &&
      history.push(`/filters?${stringifiedFilterParams}`);
  };

  const onPageChange = (currentPage, pageLength) => {
    setCurrentPage(currentPage.current);
  };

  let displayContent = loading ? (
    <div className="loading-indicator">
      <LoadingOutlined width={100} height={100} />
    </div>
  ) : (
    <div className="table-container">
      {launchesToDisplay && launchesToDisplay.length > 0 ? (
        <>
          <Table
            columns={columns}
            dataSource={generateTableData(launchesToDisplay)}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  let launchToModal = launchesToDisplay.filter((launch) => {
                    return launch.mission_name === record.mission;
                  })[0];
                  setLaunchToModal(launchToModal);
                  openModal();
                },
              };
            }}
            onChange={onPageChange}
            pagination={{ current: currentPage }}
          />
          <LaunchDetailsModal
            launchToModal={launchToModal}
            visible={isModalVisible}
            handleCancel={handleCancel}
          />
          {isCalendarFilterVisible && (
            <CalendarFilterPicker
              onRangeChange={onRangeChange}
              filterMatchCount={filterMatchCount}
              totalCount={launchesData.length}
            />
          )}
        </>
      ) : (
        <h2 className="indicator">No results found for the specified filter</h2>
      )}
    </div>
  );
  return displayContent;
}
