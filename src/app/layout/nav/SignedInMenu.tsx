import { Link, useNavigate } from 'react-router-dom';
import { Menu, Image, Dropdown } from 'semantic-ui-react';

type Props = {
    setAuth: (value: boolean) => void;
}

export default function SignedInMenu({setAuth}: Props) {
    const navigate = useNavigate();

    function handleSignOut() {
        setAuth(false);
        navigate('/');
    }

    return (
        <Menu.Item position='right'>
            <Image avatar spaced='right' src='/user.png' />
            <Dropdown pointing='top left' text='Bob'>
                <Dropdown.Menu>
                    <Dropdown.Item as={Link} to='/createEvent' text='Create event' icon='plus' />
                    <Dropdown.Item text='My profile' icon='user' />
                    <Dropdown.Item onClick={handleSignOut} text='Sign out' icon='power' />
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Item>
    )
}