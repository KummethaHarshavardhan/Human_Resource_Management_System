function AttendanceHistory({ history }) {
    return (
        <div>
            <h2>Attendance History</h2>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Working Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        history.length === 0 ?
                        (
                            <tr>
                                <td colSpan="5">
                                    No Attendance Found
                                </td>
                            </tr>
                        )
                        :
                        (
                            history.map((attendance) => (
                                <tr key={attendance._id}>
                                    <td>{attendance.date}</td>
                                    <td>{attendance.status}</td>
                                    <td>{attendance.checkIn}</td>
                                    <td>{attendance.checkOut}</td>
                                    <td>{attendance.workingHours}</td>
                                </tr>
                            ))
                        )
                    }
                </tbody>
            </table>
        </div>
    );
}
export default AttendanceHistory;