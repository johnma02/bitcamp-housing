import { useEffect, useState } from 'react';
import { Table } from 'antd';

interface RowData {
  housing_id: number;
  longitude: number;
  latitude: number;
//   housing_median_age: number;
//   total_rooms: number;
//   total_bedrooms: number;
//   population: number;
//   households: number;
//   median_income: number;
  median_house_value: number;
//   ocean_proximity: string;
}


export default function MapTable(): JSX.Element {
    const [data, setData] = useState<RowData[]>([]);
    const fetchData = async () =>{
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
    };
    
    const columns = [
        {
            title: 'housing_id',
            dataIndex: 'housing_id',
            key: 'housing_id',
        },
        {
            title: 'Longitude',
            dataIndex: 'longitude',
            key: 'longitude',
        },
        {
            title: 'Latitude',
            dataIndex: 'latitude',
            key: 'latitude',
        },
        {
            title: 'Median House Value',
            dataIndex: 'median_house_value',
            key: 'median_house_value',
        }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <Table dataSource={data} columns={columns} />
        </div>
    );
};
