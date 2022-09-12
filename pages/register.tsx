import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect }: any = router.query;
  console.log('login redircet', redirect);

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  }: any = useForm();
  const submitHandler = async ({ name, email, password }: any) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });

      const result: any = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title='Create Account'>
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}>
        <h1 className='mb-4 text-xl'>Create Account</h1>
        {/* name */}
        <div className='mb-4'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            className='w-full'
            id='name'
            autoFocus
            {...register('name', {
              required: 'Please enter name',
            })}
          />
          <p className='text-red-500'>{errors.name && errors.name.message}</p>
        </div>

        {/* email */}
        <div className='mb-4'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter valid email',
              },
            })}
            className='w-full'
            id='email'
          />
          <p className='text-red-500'>{errors.email && errors.email.message}</p>
        </div>
        {/* password */}
        <div className='mb-4'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            {...register('password', {
              required: 'Please enter password',
              minLength: { value: 6, message: 'password is more than 5 chars' },
            })}
            className='w-full'
            id='password'
            autoFocus
          />
          <p className='text-red-500'>
            {errors.password && errors.password.message}
          </p>
        </div>
        {/* confirm password */}
        <div className='mb-4'>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            className='w-full'
            type='password'
            id='confirmPassword'
            {...register('confirmPassword', {
              required: 'Please enter confirm password',
              validate: (value: any) => value === getValues('password'),
              minLength: {
                value: 6,
                message: 'confirm password is more than 5 chars',
              },
            })}
          />
          <p className='text-red-500'>
            {errors.confirmPassword && errors.confirmPassword.message}
          </p>
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className='text-red-500 '>Password do not match</div>
            )}
        </div>

        <div className='mb-4 '>
          <button className='primary-button'>Register</button>
        </div>
        <div className='mb-4 '>
          Don&apos;t have an account? &nbsp;
          <Link href={`/register?redirect=${redirect || '/'}`}>Register</Link>
        </div>
      </form>
    </Layout>
  );
}
