import { Segment, Item, Label } from 'semantic-ui-react';
import { AppEvent } from '../../../app/types/event';
import { Link } from 'react-router-dom';

type Props = {
    event: AppEvent
}

export default function EventDetailedSidebar({ event }: Props) {
    return (
        <>
            <Segment
                textAlign="center"
                style={{ border: 'none' }}
                attached="top"
                secondary
                inverted
                color="teal"
            >
                {event.attendees.length} People Going
            </Segment>
            <Segment attached>
                <Item.Group relaxed divided>
                    {event.attendees.map(attendee => (
                        <Item style={{ position: 'relative' }} key={attendee.id}>
                            {event.hostUid === attendee.id && (
                                <Label style={{position: 'absolute'}} color='orange' ribbon='right'>
                                    Host
                                </Label>
                            )}
                            <Item.Image size="tiny" src={attendee.photoURL || '/user.png'} />
                            <Item.Content verticalAlign="middle">
                                <Item.Header as={Link} to={`/profiles/${attendee.id}`}>
                                    <span>{attendee.displayName}</span>
                                </Item.Header>
                            </Item.Content>
                        </Item>
                    ))}
                </Item.Group>
            </Segment>
        </>
    )
}