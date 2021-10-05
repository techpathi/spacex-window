import React, { useEffect, useState } from 'react';
import { Modal, Tag } from 'antd';
import APICall from '../../utilities/APICall';
import moment from 'moment';
import {
  YoutubeOutlined,
  BookOutlined,
  RedditOutlined,
  LoadingOutlined
} from '@ant-design/icons';

const ROCKET_URL = 'https://api.spacexdata.com/v4/rockets/';
const PAYLOAD_URL = 'https://api.spacexdata.com/v4/payloads/';
const LAUNCHPAD_URL = 'https://api.spacexdata.com/v4/launchpads/';

export default function LaunchDetailsModal({
  launchToModal,
  visible,
  handleCancel
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsModalVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (launchToModal !== null) {
      let { rocket_id, payload_id, launchpad_id } = launchToModal;
      let rocketName,
        rocketType,
        rocketCompany,
        rocketCountry,
        launchSite,
        payloadType,
        orbit;
      setIsLoading(true);
      APICall(`${ROCKET_URL}${rocket_id}`).then(rocketData => {
        rocketName = rocketData.name;
        rocketType = `${rocketData.engines.type} ${
          rocketData.engines.version ? rocketData.engines.version : ''
        }`;
        rocketCompany = rocketData.company;
        rocketCountry = rocketData.country;
        launchToModal.rocket_type = rocketType;
        launchToModal.rocket_name = rocketName;
        launchToModal.rocket_company = rocketCompany;
        launchToModal.rocket_country = rocketCountry;
      });
      return APICall(`${PAYLOAD_URL}${payload_id}`).then(payloadData => {
        orbit = payloadData.orbit;
        payloadType = payloadData.type;
        return APICall(`${LAUNCHPAD_URL}${launchpad_id}`).then(
          launchpadData => {
            launchSite = launchpadData.name;
            launchToModal.launch_site = launchSite;
            launchToModal.payload_type = payloadType;
            launchToModal.payload_orbit = orbit;
            setIsLoading(false);
          }
        );
      });
    }
  }, [launchToModal]);

  return (
    <Modal
      className='launch-modal'
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      {isLoading ? (
        <div
          className='modal-loading-indicator
         loading-indicator'
        >
          <span style={{ marginRight: '1em' }}>Crawling Elon's tweets</span>{' '}
          <LoadingOutlined width={100} height={100} />
        </div>
      ) : (
        <>
          <div className='modal-header'>
            <div className='mission-patch'>
              <img
                src={launchToModal.mission_patch}
                width={72}
                height={72}
                alt={launchToModal.mission_name}
              />
            </div>
            <div className='mission-overview'>
              <div className='mission-name-status'>
                <p className='mission-name'>{launchToModal.mission_name}</p>
                <Tag
                  className='mission-status-badge'
                  color={
                    launchToModal.upcoming
                      ? 'orange'
                      : launchToModal.launch_success
                      ? 'green'
                      : 'red'
                  }
                >
                  {launchToModal.upcoming
                    ? 'Upcoming'
                    : launchToModal.launch_success
                    ? 'Success'
                    : 'Failed'}
                </Tag>
              </div>
              <p className='rocket-name'>{launchToModal.rocket_name}</p>

              <div className='social-links'>
                <a
                  href={launchToModal.webcast_link}
                  target='_blank'
                  rel='noreferrer'
                >
                  <YoutubeOutlined className='social-icon' />
                </a>
                <a
                  href={launchToModal.wikipedia_link}
                  target='_blank'
                  rel='noreferrer'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    x='0px'
                    y='0px'
                    width='100'
                    height='100'
                    viewBox='0 0 50 50'
                    style={{ fill: '#000000' }}
                    className='social-icon'
                  >
                    <path d='M 9 4 C 6.2504839 4 4 6.2504839 4 9 L 4 41 C 4 43.749516 6.2504839 46 9 46 L 41 46 C 43.749516 46 46 43.749516 46 41 L 46 9 C 46 6.2504839 43.749516 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.668484 6 44 7.3315161 44 9 L 44 41 C 44 42.668484 42.668484 44 41 44 L 9 44 C 7.3315161 44 6 42.668484 6 41 L 6 9 C 6 7.3315161 7.3315161 6 9 6 z M 18.375 15.998047 C 18.196 15.998047 18.017578 16.173656 18.017578 16.347656 L 18.017578 17.650391 C 18.017578 17.825391 18.196 18 18.375 18 L 19.810547 18 L 24.105469 26.019531 L 20.705078 32.119141 L 14.263672 18 L 15.642578 18 C 15.821578 18 16 17.826344 16 17.652344 L 16 16.349609 C 16 16.174609 15.821578 16 15.642578 16 L 8.3574219 16 C 8.1784219 16 8 16.173656 8 16.347656 L 8 17.650391 C 8 17.825391 8.1784219 18 8.3574219 18 L 10.505859 18 L 19.810547 36.826172 C 19.900547 36.913172 19.988969 37 20.167969 37 C 20.346969 37 20.437344 36.913172 20.527344 36.826172 L 25.269531 28.287109 L 29.652344 36.826172 C 29.742344 36.913172 29.832719 37 30.011719 37 C 30.189719 37 30.278187 36.913172 30.367188 36.826172 L 39.583984 17.912109 L 41.642578 17.912109 C 41.821578 17.912109 42 17.738453 42 17.564453 L 42 16.349609 C 42 16.174609 41.821578 16 41.642578 16 L 35.357422 16 C 35.178422 16 35 16.173656 35 16.347656 L 35 17.650391 C 35 17.825391 35.179422 18 35.357422 18 L 37.167969 18 L 30.457031 32.119141 L 26.96875 25.148438 L 31.263672 18 L 32.642578 18 C 32.821578 18 33 17.826344 33 17.652344 L 33 16.349609 C 33 16.174609 32.821578 16 32.642578 16 L 27.357422 16 C 27.178422 16 27 16.173656 27 16.347656 L 27 17.650391 C 27 17.825391 27.178422 18 27.357422 18 L 28.757812 18 L 25.804688 22.884766 L 23.388672 18 L 24.642578 18 C 24.821578 18 25 17.826344 25 17.652344 L 25 16.349609 C 25 16.174609 24.821578 15.999047 24.642578 15.998047 L 18.375 15.998047 z'></path>
                  </svg>
                </a>
                <a
                  href={launchToModal.article_link}
                  target='_blank'
                  rel='noreferrer'
                >
                  <BookOutlined className='social-icon' />
                </a>
              </div>
            </div>
          </div>
          <div className='modal-body'>
            <p className='mission-description'>
              {launchToModal.mission_description}
              <span className='wikipedia-description'>
                <a
                  href={launchToModal.wikipedia_link}
                  target='_blank'
                  rel='noreferrer'
                >
                  {' '}
                  Wikipedia
                </a>
              </span>
            </p>
            <div className='details-row'>
              <span className='detail-legend'>Flight Number</span>
              <span className='detail-value'>
                {launchToModal.flight_number}
              </span>
            </div>
            <div className='details-row'>
              <span className='detail-legend'>Mission Name</span>
              <span className='detail-value'>{launchToModal.mission_name}</span>
            </div>
            <div className='details-row'>
              <span className='detail-legend'>Rocket Type</span>
              <span className='detail-value'>{launchToModal.rocket_type}</span>
            </div>
            <div className='details-row'>
              <span className='detail-legend'>Rocket Name</span>
              <span className='detail-value'>{launchToModal.rocket_name}</span>
            </div>
            <div className='details-row'>
              <span className='detail-legend'>Manufacturer</span>
              <span className='detail-value'>
                {launchToModal.rocket_company}
              </span>
            </div>
            <div className='details-row'>
              <span className='detail-legend'>Nationality</span>
              <span className='detail-value'>
                {launchToModal.rocket_country}
              </span>
            </div>
            <div className='details-row'>
              <span className='detail-legend'>Launch Date</span>
              <span className='detail-value'>
                {moment(Date.parse(launchToModal.launch_date)).format(
                  'DD MMM YYYY HH:mm'
                )}
              </span>
            </div>
            <div className='details-row'>
              <span className='detail-legend'>Payload Type</span>
              <span className='detail-value'>{launchToModal.payload_type}</span>
            </div>
            <div className='details-row'>
              <span className='detail-legend'>Orbit</span>
              <span className='detail-value'>
                {launchToModal.payload_orbit}
              </span>
            </div>
            <div className='details-row'>
              <span className='detail-legend'>Launch Site</span>
              <span className='detail-value'>{launchToModal.launch_site}</span>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
