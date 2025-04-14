export const treeRootId = 1;
export const initialTree = {
  1: {
    id: '1',
    name: 'root',
    type: 'Node',
    children: ['2'],
    siblings: [],
    spouses: [],
    data:[]
  },
  2:{
    id:'2',
    name:"",
    type:'Child',
    children: [],
    siblings: [],
    spouses: [],
    data:['SELECT DR_NAME, HIRE_YMD FROM DOCTOR WHERE MCDP_CD = GS','진료과 코드(MCDP_CD)가 GS인 의사들의 이름(DR_NAME)과 고용일자(HIRE_YMD)를 조회합니다.','+ select']
  }
  
};