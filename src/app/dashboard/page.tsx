"use client"
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import { useState } from 'react';
import type { ColDef } from 'ag-grid-community';

const GridExample = () => {
    // Row Data: The data to be displayed.
    const [rowData] = useState([
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ]);
    // Column Definitions: Defines the columns to be displayed.
    const [colDefs] = useState<ColDef[]>([
        { field: "make" },
        { field: "model" },
        { field: "price" },
        { field: "electric" }
    ]);

    return (
        // Data Grid will fill the size of the parent container
        <div style={{ height: 500 }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                className='ag-theme-alpine'
            />
        </div>
    );
};

export default GridExample;