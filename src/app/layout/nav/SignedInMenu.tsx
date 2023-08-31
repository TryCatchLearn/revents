import { Link, useNavigate } from 'react-router-dom';
import { Menu, Image, Dropdown } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { signOut } from '../../../features/auth/authSlice';

export default function SignedInMenu() {
    const {currentUser} = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    function handleSignOut() {
        dispatch(signOut());
        navigate('/');
    }

    return (
        <Menu.Item position='right'>
            <Image avatar spaced='right' src='/user.png' />
            <Dropdown pointing='top left' text={currentUser?.email}>
                <Dropdown.Menu>
                    <Dropdown.Item as={Link} to='/createEvent' text='Create event' icon='plus' />
                    <Dropdown.Item text='My profile' icon='user' />
                    <Dropdown.Item onClick={handleSignOut} text='Sign out' icon='power' />
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Item>
    )
}