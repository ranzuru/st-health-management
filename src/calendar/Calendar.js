import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const Calendar = () => {
    const [currentEvents, setCurrentEvents] = React.useState([]);

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

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };
    return (
        <div className="w-full flex">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 p-4 rounded-md bg-gray-100 w-80 sm:w-auto md:w-80"> 
                    <Typography variant="h5">Events</Typography>
                    <List>
                        {currentEvents.map((event) => (
                            <ListItem
                                key={event.id}
                                className="my-2 p-2 rounded-md">
                                <ListItemText
                                    primary={event.title}
                                    secondary={
                                        <Typography>
                                            {formatDate(new Date(event.start))}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
                <div className="col-span-1">
                    <FullCalendar
                        height="75vh"
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
                        eventSet={(events) => setCurrentEvents(events)}
                        initialEvents={[
                            { id: "1234", title: "All day long", date: "2023-07-06" },
                            { id: "1232", title: "All I want for christmas", date: "2023-08-26" }
                        ]}
                    ></FullCalendar>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
