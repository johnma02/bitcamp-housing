import {GoogleMap, LoadScript, HeatmapLayerF, StandaloneSearchBox, CircleF} from '@react-google-maps/api';
import {useState, useEffect, useRef} from 'react';
import Form from 'react-bootstrap/Form';
import styles from '../styles/Home.module.css';
import Table from '@/components/table';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

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
const libraries : Libraries = ["visualization", "places"];


export default function Map(): JSX.Element{
    const [data, setData] = useState<RowData[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [pricing, setPricing] = useState<google.maps.visualization.WeightedLocation[]>([]);
    const [pointsReady, setPointsReady] = useState<boolean>(false);
    const [usrCoord, setUsrCoord] = useState<google.maps.LatLng | null>(null);
    const [radius, setRadius] = useState<number>(80000);
    const fetchData = async () =>{
        const response = await fetch('/api/heatmap');
        const result = await response.json();
        setData(result);
    };

    
    function handleClick(event: google.maps.MapMouseEvent) {
        setUsrCoord(event.latLng);
    }
    
    // search bar logic
    const searchRef = useRef<StandaloneSearchBox | null>(null);
    const mapRef = useRef<GoogleMap | null>(null);
    function handleSearch(){
        console.log("handling search...");
        const place = searchRef.current?.state.searchBox?.getPlaces();
        const location: (google.maps.LatLng | undefined) = place?.at(0)?.geometry?.location;
        const map = mapRef.current?.state.map;
        if(location){
            console.log(location.lat());
            console.log(location.lng());
            setUsrCoord(location);
            if (map) {
                map.panTo(location);
            } else {
                console.error("Map object not found");
            }
        } else{
            console.log("queried location does not indicate lat/long");
        }
    }

    useEffect(()=>{
        if(loaded) fetchData();
    }, [loaded]);

    useEffect(()=>{
        setPricing(data.map((x) =>  ({key: x, location: new google.maps.LatLng(x.latitude, x.longitude), weight: x.median_house_value/100000 })));
    }, [data]);
    
    useEffect(() =>{
        if(pricing.length > 200) setPointsReady(true);
    }, [pricing]);
    return(
        <div className={styles.grid}>
            <div className={styles.card}>
                <LoadScript
                    googleMapsApiKey={process.env.NEXT_PUBLIC_GMAPS_KEY as string}
                    onLoad={() => console.log('LoadScript ready')}
                    onError={() => console.log('Google Maps script loading failed')}
                    libraries={libraries}
                >
                    <GoogleMap
                        id={"map"}
                        ref={mapRef}
                        mapContainerStyle={{width: '700px', height: '700px'}}
                        zoom={6}
                        //37.865101, -119.538330 : Yosemite National Park
                        center={{lat: 37.865101, lng: -119.538330 }}
                        onClick={(e)=>handleClick(e)}
                        onLoad={()=>setLoaded(true)}>
                        <StandaloneSearchBox 
                            ref={searchRef}
                            onPlacesChanged={handleSearch}>
                            <input
                                type="text"
                                placeholder={`Find me houses within ${Math.round(radius/1000*0.621371)} miles of ...`}
                                style={{
                                    boxSizing: `border-box`,
                                    border: `1px solid transparent`,
                                    width: `280px`,
                                    height: `32px`,
                                    padding: `0 12px`,
                                    borderRadius: `3px`,
                                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                    fontSize: `14px`,
                                    outline: `none`,
                                    textOverflow: `ellipses`,
                                    position: "absolute",
                                    left: "50%",
                                    marginLeft: "-120px"
                                }}
                            />
                        </StandaloneSearchBox>
                        {(loaded && pointsReady) && <HeatmapLayerF
                            data={pricing}
                        ></HeatmapLayerF>}
                        <CircleF
                            visible={usrCoord ? true: false}
                            center={usrCoord ? usrCoord : undefined}
                            radius={radius}
                            options={{strokeColor:'blue'}}
                        ></CircleF>
                    </GoogleMap>
                </LoadScript>
            </div>

            <div className={styles.card}>
                <h2 className={inter.className}>Housing Price Data</h2>
                <Table usrCoord={usrCoord} radius={radius}></Table>
                <Form.Label style={{width: "fill"}}><h4>Search Radius</h4></Form.Label>
                <Form.Range
                    onChange={(e)=>setRadius(Number(e.target.value)*1603)}
                ></Form.Range>
            </div>
        </div>
        
    );
} 