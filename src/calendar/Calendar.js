import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const Calendar = () => {

    const handleDateClick = (selected) => {
        const title = prompt("Please enter a new title for your event");
        const calendarApi = selected.view.calendar;
        calendarApi.unselect(); // clear date selection

        if (title) {
            calendarApi.addEvent({
                id: `${selected.dateStr}-${title}`,
                title,
                start: selected.startStr,
                end: selected.endStr,
                allDay: selected.allDay
            });
        }
    };

    const handleEventClick = (selected) => {
        if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'`)) {
            selected.event.remove();
        }
    };

    return (
        <div className="w-full h-screen flex"> {/* Use h-screen to fill vertical space */}
            <div className="flex-grow"> {/* Use flex-grow to fill horizontal space */}
                        <FullCalendar
                            plugins={[
                                dayGridPlugin,
                                timeGridPlugin,
                                interactionPlugin,
                                listPlugin
                            ]}
                            headerToolbar={{
                                left: "prev,next,today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
                            }}
                            initialView="dayGridMonth"
                            editable={true}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            select={handleDateClick}
                            eventClick={handleEventClick}
                            initialEvents={[
                                { id: "1234", title: "All day long", date: "2023-07-06" },
                                { id: "1232", title: "All I want for christmas", date: "2023-08-26" }
                            ]}
                            height="100%" // Remove explicit height setting
                        ></FullCalendar>
                    </div>
                </div>
    );
};

export default Calendar;
