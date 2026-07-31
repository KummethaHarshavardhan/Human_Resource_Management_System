function MonthlyAttendance({ monthlyAttendance }) {
    return (
        <div>
            <h2>Monthly Attendance</h2>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Working Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        monthlyAttendance.length === 0 ?
                        (
                            <tr>
                                <td colSpan="3">
                                    No Monthly Records
                                </td>
                            </tr>
                        )
                        :
                        (
                            monthlyAttendance.map((attendance) => (
                                <tr key={attendance._id}>
                                    <td>{attendance.date}</td>
                                    <td>{attendance.status}</td>
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
export default MonthlyAttendance;