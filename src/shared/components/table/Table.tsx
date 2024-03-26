import React from 'react';

type TableProps = {
  data: any[];
  tableStyle?: React.CSSProperties;
};

const Table: React.FC<TableProps> = ({ data, tableStyle }) => {
  // Obtén las claves del primer objeto en el array
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <table style={{ ...tableStyle, borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {headers.map((header, i) => (
              <td key={i} style={{ border: '1px solid black', padding: '10px' }}>
                {item[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;