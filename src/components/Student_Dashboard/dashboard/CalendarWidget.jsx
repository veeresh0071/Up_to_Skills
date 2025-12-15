import React, { useEffect, useState } from "react";

function CalendarWidget() {
  const [calendarData, setCalendarData] = useState({
    month: "",
    year: "",
    days: [],
  });

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const monthIndex = today.getMonth();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[monthIndex];

    const firstDay = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();

    const daysArray = [];
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      daysArray.push(d);
    }

    setCalendarData({ month, year, days: daysArray });
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow calendar-widget">
      {/* Header */}
      <div className="calendar-header mb-3 text-center">
        <h4 className="text-lg font-semibold">
          {`${calendarData.month} ${calendarData.year}`}
        </h4>
      </div>

      {/* Scrollable Calendar */}
      <div className="overflow-x-auto">
        <div className="min-w-[320px]">
          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-1 text-sm">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-7 text-center gap-[2px]">
            {calendarData.days.map((day, index) => {
              const today = new Date();
              const isToday =
                day === today.getDate() &&
                calendarData.month === today.toLocaleString("default", { month: "long" }) &&
                calendarData.year === today.getFullYear();

              return (
                <div
                  key={index}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                    isToday
                      ? "bg-blue-500 text-white font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {day || ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarWidget;
