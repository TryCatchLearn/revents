import { FieldValues, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom';
import { Button, Form, Header, Icon, Label, Segment } from 'semantic-ui-react';
import { useAppSelector } from '../../app/store/store';
import { useEffect } from 'react';
import { auth } from '../../app/config/firebase';
import { updatePassword } from 'firebase/auth';
import { toast } from 'react-toastify';

export default function AccountPage() {
    const { currentUser } = useAppSelector(state => state.auth);

    const { register, handleSubmit, reset, getValues, setError, watch, trigger, formState: { errors, isSubmitting, isValid } } = useForm({
        mode: 'onTouched'
    })
    const password1 = watch('password1');
    const password2 = watch('password2');

    useEffect(() => {
        if (password2) trigger('password2');
    }, [password2, trigger, password1])


    async function onSubmit(data: FieldValues) {
        try {
            if (auth.currentUser) {
                await updatePassword(auth.currentUser, data.password1);
                toast.success('Password updated successfully');
                reset();
            }
        } catch (error: any) {
            setError('root.serverError', {
                type: '400', message: error.message
            })
        }
    }

    return (
        <Segment>
            <Header dividing size='large' content='Account' />
            {currentUser?.providerId === 'password' &&
                <div>
                    <Header color='teal' sub content='Change password' />
                    <p>Use this form to change your password</p>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Input
                            type='password'
                            defaultValue=''
                            placeholder='Password'
                            {...register('password1', { required: true })}
                            error={errors.password1 && 'Password is required'}
                        />
                        <Form.Input
                            type='password'
                            defaultValue=''
                            placeholder='Confirm Password'
                            {...register('password2', {
                                required: true,
                                validate: {
                                    passwordMatch: value => (value === getValues().password1) || 'Passwords do not match'
                                }
                            })}
                            error={
                                errors.password2?.type === 'required' && 'Confirm Password is required' ||
                                errors.password2?.type === 'passwordMatch' && errors.password2.message
                            }
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
                            type='submit'
                            disabled={!isValid || isSubmitting}
                            size='large'
                            positive
                            content='Update password'
                        />
                    </Form>
                </div>}
            {currentUser?.providerId === 'github.com' &&
                <div>
                    <Header color='teal' sub content='GitHub account' />
                    <p>Please visit GitHub to update your account settings</p>
                    <Button as={Link} to='https://github.com' color='black'>
                        <Icon name='github' /> Go to GitHub
                    </Button>
                </div>}
            {currentUser?.providerId === 'google.com' &&
                <div>
                    <Header color='teal' sub content='Google account' />
                    <p>Please visit Google to update your account settings</p>
                    <Button as={Link} to='https://google.com' color='google plus'>
                        <Icon name='google' /> Go to Google
                    </Button>
                </div>}
        </Segment>
    )
}