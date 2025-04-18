import React from 'react'
import DataTable_form from '../../utils/DataTable_form '
export default function Modal_example(data) {
   const {step,description,tableData,query} =JSON.parse(data);

    return (
    <div>
      <p>{step}</p>
     <p>{description}</p>  
     <DataTable_form data={tableData}></DataTable_form>
    <p>{query}</p>
    </div>
  )
}
