import { useEffect } from 'react';
import { useFireStore } from '../../../app/hooks/firestore/useFirestore';
import { useAppSelector } from '../../../app/store/store'
import { actions } from './feedSlice';
import { Feed, Header, Segment } from 'semantic-ui-react';
import FeedItem from './FeedItem';

export default function NewsFeed() {
    const {currentUser} = useAppSelector(state => state.auth);
    const {loadCollection} = useFireStore(`profiles/${currentUser?.uid}/newsfeed`);
    const {data, status} = useAppSelector(state => state.feed);

    useEffect(() => {
        loadCollection(actions, {
            limit: 5,
            sort: {attribute: 'date', order: 'desc'}
        })
    }, [loadCollection])

    return (
        <>
            <Header attached color='teal' icon='newspaper' content='News feed' />
            <Segment attached='bottom' loading={status === 'loading'}>
                {data.length > 0 ? (
                    <Feed>
                        {data.map(post => (
                            <FeedItem key={post.id} post={post} />
                        ))}
                    </Feed>
                ) : (
                    <h4>No news</h4>
                )}
            </Segment>
        </>
    )
}