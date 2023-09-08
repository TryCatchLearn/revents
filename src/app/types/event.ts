export type AppEvent = {
    id: string
    title: string
    date: string
    category: string
    description: string
    city: string
    venue: string
    hostUid: string
    hostedBy: string
    hostPhotoURL: string
    isCancelled: boolean
    attendees: Attendee[]
    attendeeIds: string[]
    isHost?: boolean
    isGoing?: boolean
}

export type Attendee = {
    id: string
    displayName: string
    photoURL: string
}