import { GoogleMap, LoadScript, GroundOverlayF } from '@react-google-maps/api';
import {useState, useEffect} from 'react';
import styles from '@/styles/Home.module.css';

interface MapProps{

}
export default function Map(): JSX.Element{
    return(
        <div className={styles.card}>
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GMAPS_KEY as string}
                onLoad={() => console.log('LoadScript ready')}
                onError={() => console.log('Google Maps script loading failed')}
            >
                <GoogleMap
                    mapContainerStyle={{width: '510px', height: '700px'}}
                    zoom={4}
                    //39.0458° N, 76.6413° W
                    center={{lat: 39.0458, lng: -76.6413}}
                />
                
            </LoadScript>
        </div>
    );
} 