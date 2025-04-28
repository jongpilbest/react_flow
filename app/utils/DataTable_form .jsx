import React from 'react'

 function DataTable_form ({tableData}) {
 
   const [headers,tableDatas]= tableData
    
  console.log('re-render')

  return (
   
     <div className='w-[100%]'>

  
      <table className="border-collapse border bg-white border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            {Array.isArray(headers) &&headers.map((header, index) => (
              <th key={index} className="border bg-neutral-200 border-gray-300  text-xs  p-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tableDatas)&&tableDatas.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100">
              {Array.isArray(row) &&row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border text-xs border-gray-300 p-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

  )
}
export default DataTable_form