import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../api/client';
import dayjs from 'dayjs';

function CalendarPage() {
    const [events, setEvents] = useState([]);

    const loadEvents = async (range = {}) => {
        const { data } = await api.get('/calendar/events', {
            params: {
                start: range.startStr ?? dayjs().startOf('month').toISOString(),
                end: range.endStr ?? dayjs().endOf('month').toISOString(),
            },
        });
        setEvents(
            data.map((event) => ({
                id: event.id,
                title: `${event.title} · ${event.channel}`,
                start: event.send_at,
                allDay: false,
                extendedProps: event,
            })),
        );
    };

    useEffect(() => {
        loadEvents({});
    }, []);

    return (
        <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Scheduling</p>
                    <h1 className="text-2xl font-semibold text-white">Event calendar</h1>
                </div>
                <p className="text-xs text-slate-400">Drag events inside the calendar to reschedule (coming soon)</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    eventDisplay="block"
                    eventColor="#6366f1"
                    eventBorderColor="#6366f1"
                    height="auto"
                    datesSet={loadEvents}
                />
            </div>
        </div>
    );
}

export default CalendarPage;
