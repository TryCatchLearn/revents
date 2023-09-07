export type Profile = {
    id: string
    photoURL: string | null
    displayName: string | null
    createdAt: string
    description: string
}

export type Photo = {
    id: string
    name: string
    url: string
}