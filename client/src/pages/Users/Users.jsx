import './Users.css';

function Users() {
  const users = [
    {
      id: 'EMP001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@company.com',
      department: 'Engineering',
      role: 'Employee',
      status: 'Active'
    },
    {
      id: 'EMP002',
      name: 'Priya Kumar',
      email: 'priya.kumar@company.com',
      department: 'Human Resources',
      role: 'HR',
      status: 'Active'
    },
    {
      id: 'EMP003',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@company.com',
      department: 'Finance',
      role: 'Employee',
      status: 'Active'
    },
    {
      id: 'EMP004',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@company.com',
      department: 'Engineering',
      role: 'Employee',
      status: 'Inactive'
    }
  ];

  return (
    <div className="users-page">

      <div className="users-header">
        <div>
          <h1>User Management</h1>
          <p>Manage employees, roles and account access.</p>
        </div>

        <button className="add-user-btn">
          + Add User
        </button>
      </div>

      <div className="users-toolbar">

        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search users..."
          />
        </div>

        <select>
          <option>All Departments</option>
          <option>Engineering</option>
          <option>Human Resources</option>
          <option>Finance</option>
        </select>

        <select>
          <option>All Roles</option>
          <option>Admin</option>
          <option>HR</option>
          <option>Employee</option>
        </select>

      </div>

      <div className="users-card">

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (
                <tr key={user.id}>

                  <td>
                    <div className="employee-info">

                      <div className="employee-avatar">
                        {user.name
                          .split(' ')
                          .map(word => word[0])
                          .join('')}
                      </div>

                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>

                    </div>
                  </td>

                  <td>{user.id}</td>

                  <td>{user.department}</td>

                  <td>
                    <span className="role-badge">
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        user.status === 'Active'
                          ? 'status active'
                          : 'status inactive'
                      }
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <button className="action-btn">
                      ⋮
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        <div className="table-footer">
          <span>Showing 4 of 248 users</span>

          <div className="pagination">
            <button>‹</button>
            <button className="current">1</button>
            <button>2</button>
            <button>3</button>
            <button>›</button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Users;