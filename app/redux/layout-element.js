import { Position } from '@xyflow/react';
import { layoutFromMap } from 'entitree-flex';
 
const nodeWidth = 404;
const nodeHeight = 200;
 
const Orientation = {
  Vertical: 'vertical',
  Horizontal: 'horizontal',
};
 
const entitreeSettings = {
  clone: true, // returns a copy of the input, if your application does not allow editing the original object
  enableFlex: true, // has slightly better performance if turned off (node.width, node.height will not be read)
  firstDegreeSpacing: 300, // spacing in px between nodes belonging to the same source, e.g. children with same parent
  nextAfterAccessor: 'spouses', // the side node prop used to go sideways, AFTER the current node
  nextAfterSpacing: 300, // the spacing of the "side" nodes AFTER the current node
  nextBeforeAccessor: 'siblings', // the side node prop used to go sideways, BEFORE the current node
  nextBeforeSpacing: 300, // the spacing of the "side" nodes BEFORE the current node
  nodeHeight, // default node height in px
  nodeWidth, // default node width in px
  orientation: Orientation.Vertical, // "vertical" to see parents top and children bottom, "horizontal" to see parents left and
  rootX: 50, // set root position if other than 0
  rootY: 50, // set root position if other than 0
  secondDegreeSpacing: 300, // spacing in px between nodes not belonging to same parent eg "cousin" nodes
  sourcesAccessor: 'parents', // the prop used as the array of ancestors ids
  sourceTargetSpacing:300, // the "vertical" spacing between nodes in vertical orientation, horizontal otherwise
  targetsAccessor: 'children', // the prop used as the array of children ids
};
 
const { Top, Bottom, Left, Right } = Position;
 
export const layoutElements = (tree, rootId, direction = 'TB') => {
  const isTreeHorizontal = direction === 'LR';
  
 
  const { nodes: entitreeNodes, rels: entitreeEdges } = layoutFromMap(
    rootId,
    tree,
    {
      ...entitreeSettings,
      orientation: isTreeHorizontal
        ? Orientation.Horizontal
        : Orientation.Vertical,
    },
  );


 

 

   let edges=[];
   let nodes=[];
  entitreeEdges.forEach((edge) => {

  


    const sourceNode = edge.source.id;
    const targetNode = edge.target.id;
     
    const newEdge = {};
 
    newEdge.id = 'e' + sourceNode + targetNode;
    newEdge.source = sourceNode;
    newEdge.target = targetNode;
    newEdge.type = 'custom';
    newEdge.animated = true;
    newEdge.data=''
 
    // Check if target node is spouse or sibling
    const isTargetSpouse = !!edge.target.isSpouse;
    const isTargetSibling = !!edge.target.isSibling;
 
    if (isTargetSpouse) {
      newEdge.sourceHandle = isTreeHorizontal ? Bottom : Right;
      newEdge.targetHandle = isTreeHorizontal ? Top : Left;
    } else if (isTargetSibling) {
      newEdge.sourceHandle = isTreeHorizontal ? Top : Left;
      newEdge.targetHandle = isTreeHorizontal ? Bottom : Right;
    } else {
      newEdge.sourceHandle = isTreeHorizontal ? Right : Bottom;
      newEdge.targetHandle = isTreeHorizontal ? Left : Top;
    }
 
    edges.push(newEdge);
  });
 
  entitreeNodes.forEach((node,index) => {
    const newNode = {};
 
    const isSpouse = !!node?.isSpouse;
    const isSibling = !!node?.isSibling;
    const isRoot = node?.id === rootId;
 
    if (isSpouse) {
      newNode.sourcePosition = isTreeHorizontal ? Bottom : Right;
      newNode.targetPosition = isTreeHorizontal ? Top : Left;
    } else if (isSibling) {
      newNode.sourcePosition = isTreeHorizontal ? Top : Left;
      newNode.targetPosition = isTreeHorizontal ? Bottom : Right;
    } else {
      newNode.sourcePosition = isTreeHorizontal ? Right : Bottom;
      newNode.targetPosition = isTreeHorizontal ? Left : Top;
    }
 
    newNode.data = { label: node.name, direction, isRoot, ...node };
    newNode.id = node.id;
    newNode.type = node.type;
 
    newNode.width = nodeWidth;
    newNode.height = nodeHeight;
 
    newNode.position = {
      x: node.x,
      y: node.y,
    };
    newNode.sql=node.data[0];
    newNode.description=node.data[1];
    node.data[3]!=undefined? newNode.tableData=node.data[3]: newNode.tableData='';

    if( edges[index] && node.data[2]) {edges[index].data=node.data[2] ;  } 
  
    nodes.push(newNode);
  });
 

 
  return { nodes, edges };
};