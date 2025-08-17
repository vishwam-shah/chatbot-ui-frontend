"use client"
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import { useState, useEffect } from 'react';
import type { ColDef } from 'ag-grid-community';

interface DashboardRow {
    id: number;
    name: string;
    score: number;
}

const colDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'score', headerName: 'Score' }
];

const GridExample = () => {
    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState<DashboardRow[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
            try {
                const res = await fetch(`${backendUrl}/api/dashboard-data`);
                const data = await res.json();
                setRowData(data.rows || []);
            } catch {
                setRowData([]);
            }
        };
        fetchData();
    }, []);

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