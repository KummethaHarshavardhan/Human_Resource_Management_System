import "../../styles/table.css";

const Table = () => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Department</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>1</td>
          <td>John</td>
          <td>HR</td>
        </tr>

        <tr>
          <td>2</td>
          <td>David</td>
          <td>Finance</td>
        </tr>
      </tbody>
    </table>
  );
};

export default Table;