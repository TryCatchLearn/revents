import { Button, Divider, Form, Label } from 'semantic-ui-react';
import ModalWrapper from '../../app/common/modals/ModalWrapper';
import { FieldValues, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../app/store/store';
import { closeModal } from '../../app/common/modals/modalSlice';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../app/config/firebase';
import SocialLogin from './SocialLogin';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const navigate = useNavigate();
    const {data: location} = useAppSelector(state => state.modals);
    const { register, handleSubmit, setError, formState: { isSubmitting, isValid, isDirty, errors } } = useForm({
        mode: 'onTouched'
    })
    const dispatch = useAppDispatch();

    async function onSubmit(data: FieldValues) {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            dispatch(closeModal());
            navigate(location.from);
        } catch (error: any) {
            setError('root.serverError', {
                type: '400', message: error.message
            })
        }
    }

    return (
        <ModalWrapper header='Sign into re-vents' size='mini'>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Input
                    defaultValue=''
                    placeholder='Email address'
                    {...register('email', { required: true, pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/ })}
                    error={
                        errors.email?.type === 'required' && 'Email is required' ||
                        errors.email?.type === 'pattern' && 'Email is invalid'
                    }
                />
                <Form.Input
                    type='password'
                    defaultValue=''
                    placeholder='Password'
                    {...register('password', { required: true })}
                    error={errors.password && 'Password is required'}
                />
                {errors.root && (
                    <Label
                        basic color='red'
                        style={{ display: 'block', marginBottom: 10 }}
                        content={errors.root.serverError.message}
                    />
                )}
                <Button
                    loading={isSubmitting}
                    disabled={!isValid || !isDirty || isSubmitting}
                    type='submit'
                    fluid
                    size='large'
                    color='teal'
                    content='Login'
                />
                <Divider horizontal>Or</Divider>
                <SocialLogin />
            </Form>
        </ModalWrapper>
    )
}