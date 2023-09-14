import { Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic } from 'semantic-ui-react';
import { Profile } from '../../app/types/profile';
import { auth, db } from '../../app/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store/store';
import { actions } from './profileSlice';
import { toast } from 'react-toastify';
import { batchFollowToggle } from '../../app/actions/firestoreActions';

type Props = {
    profile: Profile
}

export default function ProfileHeader({ profile }: Props) {
    const { currentUser } = useAppSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const docRef = doc(db, `profiles/${profile.id}/followers/${auth.currentUser?.uid}`);
        getDoc(docRef).then(docSnap => {
            dispatch(actions.setFollowing({ id: profile.id, isFollowing: docSnap.exists() }))
        })
    }, [dispatch, profile.id]);

    async function handleFollowToggle(follow: boolean) {
        if (!profile.id || !auth.currentUser?.uid) return;
        setLoading(true);
        try {
            await batchFollowToggle(profile, follow);
            dispatch(actions.setFollowing({ id: profile.id, isFollowing: follow }));
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image avatar size='small' src={profile.photoURL || '/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1'
                                    style={{ display: 'block', marginBottom: 10 }}
                                    content={profile.displayName}
                                />
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group>
                        <Statistic label='Followers' value={profile.followerCount || 0} />
                        <Statistic label='Following' value={profile.followingCount || 0} />
                    </Statistic.Group>
                    {currentUser?.uid !== profile.id && (
                        <>
                            <Divider />

                            <Reveal animated='move'>
                                <Reveal.Content visible style={{ width: '100%' }}>
                                    <Button fluid color='teal'
                                        content={profile.isFollowing ? 'Following' : 'Not following'} />
                                </Reveal.Content>
                                <Reveal.Content hidden style={{ width: '100%' }}>
                                    <Button
                                        basic
                                        fluid
                                        color={profile.isFollowing ? 'red' : 'green'}
                                        content={profile.isFollowing ? 'Unfollow' : 'Follow'}
                                        onClick={() => handleFollowToggle(!profile.isFollowing)}
                                        loading={loading}
                                    />
                                </Reveal.Content>
                            </Reveal>
                        </>
                    )}


                </Grid.Column>
            </Grid>
        </Segment>
    )
}