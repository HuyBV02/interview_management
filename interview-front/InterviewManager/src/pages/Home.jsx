import { Form, InputGroup } from "react-bootstrap";
import { Helmet } from "react-helmet";
import axios from "axios";
import moment from "moment";
import Select from "react-select";
import { useEffect, useState, useRef } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import '../assets/styles/calendar.css';

const Home = () => {
    const [timeSlot, setTimeSlot] = useState([]);
    const [interviewers, setInterviewers] = useState([]);
    const [pickedId, setPickedId] = useState(0);
    const [pickedDate, setPickedDate] = useState(new Date().toISOString().split('T')[0]);
    const [pickedInterviewer, setPickedInterviewer] = useState({
        fullName: "",
        username: "",
        userId: 0
    },)
    const calendarRef = useRef(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchInterviews();
    }, [pickedId, pickedDate]);

    useEffect(() => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            setTimeout(() => {
                calendarApi.gotoDate(pickedDate);
            }, 0);
        }
    }, [pickedDate]);

    useEffect(() => { getInterviewer() }, []);

    const getInterviewer = async () => {
        await axios
            .get("http://localhost:8082/api/user/list/4?search", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setInterviewers(response.data.data);
            })
            .catch((error) => console.log(error));
    };

    const fetchInterviews = async () => {
        const requestBody = {
            date: pickedDate,
        };
        await axios
            .post(
                `http://localhost:8082/api/user/${pickedId}/schedule`,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                const data = response.data.data;
                setTimeSlot(data.interviews.map(interview => ({
                    title: interview.title,
                    start: formatDateTime(interview.startTime),
                    end: formatDateTime(interview.endTime)
                })));
            })
            .catch((error) => {
                console.error("There was an error fetching the interviews!", error);
            });
    };

    const formatDateTime = (dateTime) => {
        const [day, month, yearAndTime] = dateTime.split('-');
        const [year, time] = yearAndTime.split(' ');
        return `${year}-${month}-${day}T${time}`;
    };

    const interviewerOptions = interviewers?.map((user) => ({
        value: user.userId,
        label: user.fullName + " - " + user.username,
    }));

    const handleSelectChange = (selectedOption) => {
        if (selectedOption) {
            const choice = selectedOption.value;
            setPickedInterviewer(
                interviewers?.find((user) => user.userId === choice)
            );
            setPickedId(choice);
        }
    }

    const dayHeaderContent = (args) => {
        const date = args.date;
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNumber = date.getDate();

        return (
            <div className="custom-day-header">
                {dayName} {dayNumber}
            </div>
        );
    };
    return (
        <>
            <Helmet>
                <title>Interview Scheduler</title>
            </Helmet>
            <div className="mt-3 mb-3">
                <strong className="text-[16px]">Home</strong>
                <div className="flex justify-between">
                    <div className="shadow-sm py-3 px-3 flex justify-between mb-3 mt-3 bg-white rounded-xl w-[70%]">
                        <div className="w-[100%]">
                            <div className="flex justify-between items-center">
                                <div>
                                    <InputGroup size="sm" style={{ width: "400px" }}>
                                        <Form.Control
                                            type="date"
                                            onChange={(e) => {
                                                const date = moment(e.target.value, "YYYY-MM-DD").format("YYYY-MM-DD");
                                                setPickedDate(date);
                                            }}
                                        />
                                    </InputGroup>
                                </div>
                                <div>
                                    <InputGroup size="sm" style={{ width: "400px" }}>
                                        <Select
                                            className="select"
                                            placeholder="search interviewer..."
                                            options={interviewerOptions}
                                            value={interviewerOptions?.find(
                                                (option) => option.value === pickedInterviewer.userId
                                            )}
                                            onChange={(selectedOption) => {
                                                handleSelectChange(selectedOption);
                                            }}
                                            isDisabled={false}
                                        />
                                    </InputGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="shadow-sm p-2 rounded-xl bg-white">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="timeGridWeek"
                        initialDate={pickedDate}
                        headerToolbar={{
                            left: '',
                            center: 'title',
                            right: ''
                        }}
                        eventTimeFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                            meridiem: 'short'
                        }}
                        allDaySlot={false}
                        events={timeSlot}
                        eventClassNames={() => 'event'}
                        dayHeaderClassNames={() => 'p-1 text'}
                        slotLabelClassNames={() => 'p-1 text'}
                        dayCellClassNames={() => ''}
                        dayHeaderContent={dayHeaderContent}
                        height="auto"
                        contentHeight="auto"
                    />
                </div>
            </div>
        </>
    );
};

export default Home;
