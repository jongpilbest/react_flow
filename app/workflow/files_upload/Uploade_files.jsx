"use client";
import { Download } from "lucide-react";
import { useState, useRef } from "react";
import React from "react";
import Papa from "papaparse";
import { useDispatch, useSelector } from "react-redux";
import DataTable_form from '@/app/utils/DataTable_form '


function CSVUploader({ id }) {
  const dispatch = useDispatch();
  const node_data = useSelector((state) => state.db[id]); // Redux에서 ID 기반 데이터 가져오기
  const idRef = useRef(id); // ✅ ID 값 유지 (파일 업로드 시 변경 방지)
  const [tableData, setTableData] = useState([]); // CSV 데이터를 저장할 상태

  console.log("🚀 현재 ID:", id, "| Redux 데이터:", node_data);

  const handleFileUpload = (event,id) => {
    event.preventDefault(); // 기본 동작 방지
    console.log(event,id)
   // const file = event.target.files[0];
   // if (!file) return;
//
   // Papa.parse(file, {
   //   complete: (result) => {
   //     const [firstRow, ...rows] = result.data;
//
   //     const jsonDataArray = rows.map((row) =>
   //       Object.fromEntries(
   //         firstRow.map((header, index) =>
   //           row[index] === "" ? [header, "NULL"] : [header, row[index]]
   //         )
   //       )
   //     );
//
   //     console.log("🔹 파일 업로드 - ID:", id, jsonDataArray);
//
   //     // ✅ Redux에 저장 (파일 업로드 시 ID 유지)
   //     dispatch(
   //       store_db({
   //         name: id, // useRef를 사용해 ID 유지
   //         db: jsonDataArray,
   //       })
   //     );
//
   //     setTableData([firstRow, rows]); // 테이블 데이터 업데이트
   //   },
   //   header: false, // 첫 행을 헤더로 수동 설정
   //   skipEmptyLines: true,
   // });
  };

  return (
    <div className="p-1 bg-secondary w-full">
     

      {/* 파일 업로드 */}
      <input
        type="file"
        id={id}
        accept=".csv"
        onChange={(e)=>handleFileUpload(e,idRef.current)}
        className="mb-4 hidden"
      />

      {/* 파일 선택 UI */}
      {tableData.length === 0 && (
        <label
          htmlFor={id}
          className="cursor-pointer px-4 py-2 justify-center bg-secondary text-white font-semibold rounded-md flex items-center gap-2 transition"
        >
          <Download size={16} className="stroke-gray-400 hover:stroke-blue-600" />
        </label>
      )}

      {/* CSV 데이터를 테이블로 렌더링 */}
      {tableData.length > 0 && <DataTable tableData={tableData} id={idRef.current} />}
    </div>
  );
}

export default React.memo(CSVUploader);
