function TodayAttendanceCard({ attendance }) {

    return (
        <div>

            <h3>Today's Attendance</h3>

            <p>
                <strong>Status :</strong>{" "}
                {attendance?.status || "--"}
            </p>

            <p>
                <strong>Check In :</strong>{" "}
                {attendance?.checkIn || "--"}
            </p>

            <p>
                <strong>Check Out :</strong>{" "}
                {attendance?.checkOut || "--"}
            </p>

            <p>
                <strong>Working Hours :</strong>{" "}
                {attendance?.workingHours || "--"}
            </p>

            <p>
                <strong>Location :</strong>{" "}
                {attendance?.location || "--"}
            </p>

            <p>
                <strong>Remarks :</strong>{" "}
                {attendance?.remarks || "--"}
            </p>

        </div>
    );
}

export default TodayAttendanceCard;