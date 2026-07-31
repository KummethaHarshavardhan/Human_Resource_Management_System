import axios from "axios";

const API = "http://localhost:5000/api/attendance";

export async function checkIn(data) {
    const response = await axios.post(`${API}/check-in`, data);
    return response.data;
}

export async function checkOut(employeeId) {
    const response = await axios.post(`${API}/check-out`, {
        employeeId
    });
    return response.data;
}

export async function getTodayAttendance(employeeId) {
    const response = await axios.get(`${API}/today/${employeeId}`);
    return response.data;
}

export async function getAttendanceHistory(employeeId) {
    const response = await axios.get(`${API}/history/${employeeId}`);
    return response.data;
}

export async function getMonthlyAttendance(employeeId, year, month) {
    const response = await axios.get(
        `${API}/month/${employeeId}/${year}/${month}`
    );
    return response.data;
}
export async function getAttendanceCalendar(employeeId, year, month) {

    const response = await axios.get(
        `${API}/calendar/${employeeId}/${year}/${month}`
    );

    return response.data;

}