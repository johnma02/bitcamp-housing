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

interface MapTableProps{
    usrCoord: google.maps.LatLng | null
}


export default function MapTable({usrCoord}:MapTableProps): JSX.Element {
    const [data, setData] = useState<RowData[]>([]);
    const fetchData = async () =>{
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
    };
    const fetchCoord = async (usrCoord:google.maps.LatLng | null) =>{
        const response = await fetch("/api/coord",{
            "method":"GET",
            "headers":{
                "lng":"${usrCoord.lng()}",
                "lat":"${usrCoord.lat()}"
            },
        });
        const result = await response.json();
        setData(result);
    };
    
    const columns = [
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
            title: 'Average House Value',
            dataIndex: 'avg_house_value',
            key: 'avg_house_value',
        }
    ];

    // useEffect(() => {
    //     fetchData();
    // }, []);

    // useEffect(() => {
    //     fetchCoord(usrCoord);
    // }, [usrCoord]);

    return (
        <div>
            <Table dataSource={data.map((row, index) => ({ ...row, key: index }))} columns={columns} />
        </div>
    );
};

