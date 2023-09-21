import { Button, Dropdown, Icon } from 'semantic-ui-react'
import { useAppDispatch, useAppSelector } from '../../app/store/store'
import { decrement, increment, incrementByAmount } from './testSlice';
import { openModal } from '../../app/common/modals/modalSlice';
import usePlacesAutocomplete, { LatLng, getGeocode, getLatLng } from 'use-places-autocomplete';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { useState } from 'react';

export default function Scratch() {
    const [location, setLocation] = useState<LatLng>({
        lat: 59.95,
        lng: 30.33
    })
    const { suggestions: { data: locations, loading }, setValue } = usePlacesAutocomplete();
    const { data } = useAppSelector(state => state.test);
    const dispatch = useAppDispatch();

    async function handlePlaceSelect(value: any) {
        const results = await getGeocode({ address: value });
        const latlng = getLatLng(results[0]);
        setLocation(latlng);
    }

    return (
        <div>
            <h1>Scratch page</h1>
            <h3>The data is: {data}</h3>
            <Button onClick={() => dispatch(increment())} color='green' content='Increment' />
            <Button onClick={() => dispatch(decrement())} color='red' content='Decrement' />
            <Button onClick={() => dispatch(incrementByAmount(5))} color='teal' content='Increment by 5' />
            <Button
                onClick={() => dispatch(openModal({ type: 'TestModal', data: data }))}
                color='teal' content='Open modal'
                style={{ marginBottom: 20 }}
            />

            <Dropdown
                placeholder='Search for location'
                loading={loading}
                fluid
                search
                selection
                options={locations.map(({ description }) => ({
                    text: description,
                    value: description
                }))}
                onSearchChange={(e: any) => {
                    setValue(e.target.value)
                }}
                onChange={(_e, data) => {
                    handlePlaceSelect(data.value)
                }}
            />

            <GoogleMap
                mapContainerStyle={{
                    width: '100%',
                    height: '50vh',
                    marginTop: 20
                }}
                center={location}
                zoom={14}
            >
                <MarkerF
                    position={location}
                >
                    <Icon name='map marker' color='red' />
                </MarkerF>
            </GoogleMap>
        </div>
    )
}