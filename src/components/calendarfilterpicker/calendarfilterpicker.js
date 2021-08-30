import React, { useState } from "react";
import { DatePicker, Modal, Statistic } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;

export default function CalendarFilterPicker({
  onRangeChange,
  filterMatchCount,
  totalCount,
}) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleRangeSelection = (dates, dateStrings) => {
    onRangeChange(dates);
  };

  const disabledDate = (current) => {
    return current > moment().endOf("year");
  };

  return (
    <div className="calendar-filter-modal">
      <Modal
        visible={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <div style={{ display: "inline-flex" }}>
          <RangePicker
            onChange={handleRangeSelection}
            disabledDate={disabledDate}
          />
          <Statistic
            title="Matches"
            value={filterMatchCount}
            suffix={`/ ${totalCount}`}
            style={{ marginLeft: "1em" }}
          />
        </div>
      </Modal>
    </div>
  );
}
