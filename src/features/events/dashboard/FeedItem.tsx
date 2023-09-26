import { Link } from 'react-router-dom'
import { Post } from '../../../app/types/post'
import { Feed } from 'semantic-ui-react'
import { formatDistance } from 'date-fns'

type Props = {
    post: Post
}

export default function FeedItem({ post }: Props) {
    const eventLink = <Link to={`/events/${post.eventId}`}>{post.title}</Link>
    const summary = post.status === 'attending' ?
        <div>{post.displayName} is attending {eventLink}</div> : post.status === 'removed' ?
        <div>{post.displayName} is no longer attending {eventLink}</div> :
        <div>{post.displayName} has created a new event! {eventLink}</div>

    return (
        <Feed.Event 
            image={post.photoURL}
            date={formatDistance(new Date(post.date), new Date()) + ' ago'}
            summary={summary}
        />
    )
}