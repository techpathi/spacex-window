import React, { useEffect, useState } from "react";
import { Modal, Tag } from "antd";
import moment from "moment";
import {
  YoutubeOutlined,
  BookOutlined,
  RedditOutlined,
} from "@ant-design/icons";

export default function LaunchDetailsModal({
  launchToModal,
  visible,
  handleCancel,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    setIsModalVisible(visible);
  }, [visible]);

  return (
    <Modal
      className="launch-modal"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      {launchToModal && (
        <>
          <div className="modal-header">
            <div className="mission-patch">
              <img
                src={launchToModal.mission_patch}
                width={72}
                height={72}
                alt={launchToModal.mission_name}
              />
            </div>
            <div className="mission-overview">
              <div className="mission-name-status">
                <p className="mission-name">{launchToModal.mission_name}</p>
                <Tag
                  className="mission-status-badge"
                  color={
                    launchToModal.upcoming
                      ? "orange"
                      : launchToModal.launch_success
                      ? "green"
                      : "red"
                  }
                >
                  {launchToModal.upcoming
                    ? "Upcoming"
                    : launchToModal.launch_success
                    ? "Success"
                    : "Failed"}
                </Tag>
              </div>
              <p className="rocket-name">{launchToModal.rocket_name}</p>
              <div className="social-links">
                <a
                  href={launchToModal.article_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <BookOutlined className="social-icon" />
                </a>
                <a
                  href={launchToModal.wikipedia_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <RedditOutlined className="social-icon" />
                </a>
                <a
                  href={launchToModal.webcast_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <YoutubeOutlined className="social-icon" />
                </a>
              </div>
            </div>
          </div>
          <div className="modal-body">
            <p className="mission-description">
              {launchToModal.mission_description}
              <span className="wikipedia-description">
                <a
                  href={launchToModal.wikipedia_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {" "}
                  Wikipedia
                </a>
              </span>
            </p>
            <div className="details-row">
              <span className="detail-legend">Flight Number</span>
              <span className="detail-value">
                {launchToModal.flight_number}
              </span>
            </div>
            <div className="details-row">
              <span className="detail-legend">Mission Name</span>
              <span className="detail-value">{launchToModal.mission_name}</span>
            </div>
            <div className="details-row">
              <span className="detail-legend">Rocket Type</span>
              <span className="detail-value">{launchToModal.rocket_type}</span>
            </div>
            <div className="details-row">
              <span className="detail-legend">Rocket Name</span>
              <span className="detail-value">{launchToModal.rocket_name}</span>
            </div>
            <div className="details-row">
              <span className="detail-legend">Manufacturer</span>
              <span className="detail-value">
                {launchToModal.rocket_company}
              </span>
            </div>
            <div className="details-row">
              <span className="detail-legend">Nationality</span>
              <span className="detail-value">
                {launchToModal.rocket_country}
              </span>
            </div>
            <div className="details-row">
              <span className="detail-legend">Launch Date</span>
              <span className="detail-value">
                {moment(Date.parse(launchToModal.launch_date)).format(
                  "DD MMM YYYY HH:mm"
                )}
              </span>
            </div>
            <div className="details-row">
              <span className="detail-legend">Payload Type</span>
              <span className="detail-value">{launchToModal.payload_type}</span>
            </div>
            <div className="details-row">
              <span className="detail-legend">Orbit</span>
              <span className="detail-value">
                {launchToModal.payload_orbit}
              </span>
            </div>
            <div className="details-row">
              <span className="detail-legend">Launch Site</span>
              <span className="detail-value">{launchToModal.launch_site}</span>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
