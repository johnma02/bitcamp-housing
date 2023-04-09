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
    usrCoord: google.maps.LatLng | null;
    radius: number;
}


export default function MapTable({usrCoord, radius}:MapTableProps): JSX.Element {
    const [data, setData] = useState<RowData[]>([]);
    // const fetchData = async () =>{
    //     const response = await fetch('/api/data');
    //     const result = await response.json();
    //     setData(result);
    // };
    const fetchCoord = async (usrCoord:google.maps.LatLng | null) =>{
        if (usrCoord == null){
            const response = await fetch('/api/data');
            const result = await response.json();
            setData(result);
        } else{
            const response = await fetch(`/api/coord?lat=${usrCoord.lat()}&lng=${usrCoord.lng()}&radius=${radius}`);
            const result = await response.json();
            console.log(result);
            setData(result);
        }
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

    useEffect(() => {
        fetchCoord(usrCoord);
    }, [usrCoord]);

    return (
        <div>
            <Table 
                dataSource={data.map((row, index) => ({ ...row, key: index }))} 
                columns={columns}
                style={{width: "400px", height: "665px"}}
            />
        </div>
    );
};

