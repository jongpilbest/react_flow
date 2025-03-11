import React, { memo } from 'react';
import Nodecard from "./Nodecard";
import NodeHeader from "./NodeHeader"

const Nodecomponents = (({children,IconComponent,TextComponent,labelComponent}) => {
  
  return (
    <Nodecard>
    <NodeHeader IconComponent={IconComponent} 
    TextComponent={TextComponent}
    labelComponent={labelComponent}
     >

    </NodeHeader>
    {children}
    </Nodecard>
  );
});

export default React.memo(Nodecomponents); ;
