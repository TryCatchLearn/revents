import { createBrowserRouter } from 'react-router-dom';
import App from '../layout/App';
import EventDashboard from '../../features/events/dashboard/EventDashboard';
import EventDetailedPage from '../../features/events/details/EventDetailedPage';
import EventForm from '../../features/events/form/EventForm';
import Scratch from '../../features/scratch/Scratch';
import AccountPage from '../../features/auth/AccountPage';
import ProfilePage from '../../features/profiles/ProfilePage';
import RequireAuth from './RequireAuth';
import UnauthComponent from '../layout/UnauthComponent';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {element: <RequireAuth />, children: [
                {path: '/manage/:id', element: <EventForm />},
                {path: '/profiles/:id', element: <ProfilePage />},
                {path: '/createEvent', element: <EventForm key='create' />},
                {path: '/account', element: <AccountPage />},
            ]},
            {path: '/events', element: <EventDashboard />},
            {path: '/events/:id', element: <EventDetailedPage />},
            {path: '/scratch', element: <Scratch />},
            {path: '/unauthorised', element: <UnauthComponent />},
        ]
    }
])