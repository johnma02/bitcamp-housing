import { GoogleMap, LoadScript, GroundOverlayF } from '@react-google-maps/api';
import {useState, useEffect} from 'react';

interface MapProps{

}
export default function Map(): JSX.Element{
    return(
        <div>
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GMAPS_KEY as string}
                onLoad={() => console.log('LoadScript ready')}
                onError={() => console.log('Google Maps script loading failed')}
            >
                <GoogleMap
                    mapContainerStyle={{width: '700px', height: '700px'}}
                    zoom={3}
                    //39.0458° N, 76.6413° W
                    center={{lat: 39.0458, lng: -76.6413}}
                />
            </LoadScript>
        </div>
    );
} 