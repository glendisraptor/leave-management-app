import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import ErrorCard from '../ui/error-card';
import LoaderCard from '../ui/loader-card';

interface CalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    description?: string;
    location?: string;
    organizer?: string;
    type?: 'leave' | 'meeting' | 'other';
}

interface EventDetailsPopupProps {
    event: CalendarEvent;
    onClose: () => void;
}

const EventDetailsPopup = ({ event, onClose }: EventDetailsPopupProps) => {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {event.title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                {/* Event Details */}
                <div className="space-y-3">
                    <div className="flex items-start gap-2">
                        <svg
                            className="h-5 w-5 text-gray-400 mt-0.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <div>
                            <p className="text-sm text-gray-600">
                                {new Date(event.start).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            <p className="text-sm text-gray-600">
                                to {new Date(event.end).toLocaleDateString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    {event.location && (
                        <div className="flex items-start gap-2">
                            <svg
                                className="h-5 w-5 text-gray-400 mt-0.5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <p className="text-sm text-gray-600">{event.location}</p>
                        </div>
                    )}

                    {event.organizer && (
                        <div className="flex items-start gap-2">
                            <svg
                                className="h-5 w-5 text-gray-400 mt-0.5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            <p className="text-sm text-gray-600">{event.organizer}</p>
                        </div>
                    )}

                    {event.description && (
                        <div className="flex items-start gap-2">
                            <svg
                                className="h-5 w-5 text-gray-400 mt-0.5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M4 6h16M4 12h16M4 18h7"></path>
                            </svg>
                            <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                    )}
                </div>

                {/* Type Badge */}
                {event.type && (
                    <div className="mt-4">
                        <span className={`
              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${event.type === 'leave' ? 'bg-yellow-100 text-yellow-800' : ''}
              ${event.type === 'meeting' ? 'bg-blue-100 text-blue-800' : ''}
              ${event.type === 'other' ? 'bg-gray-100 text-gray-800' : ''}
            `}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

const CalendarPage = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    useEffect(() => {
        // Simulate fetching events with dummy data
        const dummyEvents: CalendarEvent[] = [
            {
                id: '1',
                title: 'Annual Leave',
                start: '2024-12-10T09:00:00',
                end: '2024-12-10T17:00:00',
                type: 'leave',
                description: 'Annual leave for vacation',
                location: 'Home',
                organizer: 'John Doe'
            },
            {
                id: '2',
                title: 'Project Meeting',
                start: '2024-12-12T10:00:00',
                end: '2024-12-12T11:00:00',
                type: 'meeting',
                description: 'Meeting to discuss project progress',
                location: 'Office',
                organizer: 'Jane Smith'
            },
            {
                id: '4',
                title: 'Management Meeting',
                start: '2024-12-12T10:00:00',
                end: '2024-12-14T11:00:00',
                type: 'meeting',
                description: 'Meeting to discuss project progress',
                location: 'Office',
                organizer: 'Glen Smith'
            },
            {
                id: '3',
                title: 'Team Sync',
                start: '2024-12-15T14:00:00',
                end: '2024-12-15T15:00:00',
                type: 'meeting',
                description: 'Weekly team sync-up',
                location: 'Zoom',
                organizer: 'Paul Williams'
            }
        ];

        setEvents(dummyEvents);
        setLoading(false);
    }, []);

    if (loading) {
        return <LoaderCard text="Loading calendar..." />;
    }

    if (error) {
        return (
            <ErrorCard
                title="Calendar Error"
                message={error}
                onClose={() => setError(null)}
            />
        );
    }

    return (
        <div className="p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    eventClick={(info) => {
                        const event = events.find(e => e.id === info.event.id);
                        if (event) {
                            setSelectedEvent(event);
                        }
                    }}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,dayGridWeek'
                    }}
                    height="auto"
                    eventClassNames={(arg) => {
                        const type = arg.event.extendedProps.type || 'other';
                        return [
                            'cursor-pointer',
                            type === 'leave' ? 'bg-yellow-500 border-yellow-600' : '',
                            type === 'meeting' ? 'bg-blue-500 border-blue-600' : '',
                            type === 'other' ? 'bg-gray-500 border-gray-600' : ''
                        ];
                    }}
                />
            </div>

            {selectedEvent && (
                <EventDetailsPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />
            )}
        </div>
    );
};

export default CalendarPage;
