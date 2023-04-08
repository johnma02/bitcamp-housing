import {GoogleMap, LoadScript, HeatmapLayerF} from '@react-google-maps/api';
import {useState, useEffect} from 'react';
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
type Libraries = ("drawing" | "geometry" | "localContext" | "places" | "visualization")[];
const libraries : Libraries = ["visualization"];


export default function Map(): JSX.Element{
    const [data, setData] = useState<RowData[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [pricing, setPricing] = useState<google.maps.visualization.WeightedLocation[]>([]);
    const [pointsReady, setPointsReady] = useState<boolean>(false);
    const fetchData = async () =>{
        const response = await fetch('/api/heatmap');
        const result = await response.json();
        setData(result);
    };
    
    useEffect(()=>{
        if(loaded) fetchData();
    }, [loaded]);

    useEffect(()=>{
        setPricing(data.map((x) =>  ({location: new google.maps.LatLng(x.latitude, x.longitude), weight: x.median_house_value/100000 })));
    }, [data]);
    
    useEffect(() =>{
        if(pricing.length > 200) setPointsReady(true);
    }, [pricing]);
    return(
        <div>
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GMAPS_KEY as string}
                onLoad={() => console.log('LoadScript ready')}
                onError={() => console.log('Google Maps script loading failed')}
                libraries={libraries}
            >
                <GoogleMap
                    mapContainerStyle={{width: '700px', height: '700px'}}
                    zoom={6}
                    //37.865101, -119.538330 : Yosemite National Park
                    center={{lat: 37.865101, lng: -119.538330 }}
                    onLoad={()=>setLoaded(true)}>
                    {(loaded && pointsReady) && <HeatmapLayerF
                        data={pricing}
                    ></HeatmapLayerF>}
                </GoogleMap>
            </LoadScript>
        </div>
    );
} 