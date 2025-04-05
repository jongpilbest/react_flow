import { Node } from "@xyflow/react";

export interface AppNodeData{
    [key:string]:any;
}


export interface AppNode extends Node{
data:AppNodeData;

}