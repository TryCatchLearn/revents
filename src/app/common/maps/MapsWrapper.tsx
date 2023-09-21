import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { ReactNode } from 'react'

type Props = {
    children: ReactNode
}

export default function MapsWrapper({ children }: Props) {
    const render = (status: Status) => {
        if (status === Status.FAILURE) return <h2>Error loading maps</h2>
        return <p>Loading...</p>
    }

    return (
        <Wrapper 
            apiKey={import.meta.env.VITE_FIREBASE_API_KEY}
            libraries={['places']}
            render={render}
        >
            {children}
        </Wrapper>
    )

}