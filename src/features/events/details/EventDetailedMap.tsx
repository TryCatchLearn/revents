import { Icon, Segment } from 'semantic-ui-react'
import { LatLng } from 'use-places-autocomplete'
import MapsWrapper from '../../../app/common/maps/MapsWrapper'
import { GoogleMap, MarkerF } from '@react-google-maps/api'

type Props = {
    latLng: LatLng
}

export default function EventDetailedMap({ latLng }: Props) {
    const containerStyle = {
        width: '100%',
        height: '300px'
    }

    return (
        <Segment attached='bottom' style={{padding: 0}}>
            <MapsWrapper>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={latLng}
                    zoom={14}
                >
                    <MarkerF position={latLng}>
                        <Icon name='map marker' color='red' />
                    </MarkerF>
                </GoogleMap>
            </MapsWrapper>
        </Segment>
    )
}