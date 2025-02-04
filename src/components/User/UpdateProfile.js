import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../../utils/helpers';
import { useForm } from 'react-hook-form';
import './UpdateProfile.css';

const UpdateProfile = () => {
    const { register, handleSubmit, setValue } = useForm();
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const getProfile = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        };
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/users/me`, config);
            setValue('name', data.user.name);
            setValue('email', data.user.email);
            setValue('phone', data.user.phone);
            setValue('street', data.user.street);
            setValue('apartment', data.user.apartment);
            setValue('zip', data.user.zip);
            setValue('city', data.user.city);
            setValue('country', data.user.country);
            if (data.user.avatar && data.user.avatar.url) {
                setAvatarPreview(data.user.avatar.url);
            }
            setLoading(false);
        } catch (error) {
            toast.error('User not found', {
                position: 'bottom-right'
            });
            setLoading(false);
        }
    };

    const updateProfile = async (userData) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        };
        try {
            setLoading(true); // Set loading to true when the update starts
            const response = await axios.put(`${process.env.REACT_APP_API}/api/v1/users/updateProfile`, userData, config);
            console.log('Update response:', response.data);
            toast.success('User updated', {
                position: 'bottom-right'
            });
            navigate('/profile', { replace: true });
        } catch (error) {
            console.error('Error updating profile:', error.response ? error.response.data : error.message); // Log the error details
            toast.error('Failed to update profile. Please try again.', {
                position: 'bottom-right'
            });
        } finally {
            setLoading(false); // Set loading to false when the update completes
        }
    };

    useEffect(() => {
        setLoading(true); // Set loading to true when fetching profile starts
        getProfile();
    }, []);

    const submitHandler = (data) => {
        const formData = new FormData();
        formData.set('name', data.name);
        formData.set('email', data.email);
        formData.set('phone', data.phone);
        formData.set('street', data.street);
        formData.set('apartment', data.apartment);
        formData.set('zip', data.zip);
        formData.set('city', data.city);
        formData.set('country', data.country);
        if (data.image && data.image[0]) {
            formData.set('image', data.image[0]);
        }
        updateProfile(formData);
    };

    const onChange = e => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    return (
        <>
            <Helmet>
                <title>Update Profile</title>
            </Helmet>
            <div className="container" style={{ padding: '10px' }}>
                <div className="row wrapper">
                    <div className="col-10 col-lg-5">
                        <form className="shadow-lg" onSubmit={handleSubmit(submitHandler)} encType='multipart/form-data'>
                            <h1 className="mt-2 mb-5">Update Profile</h1>
                            <div className="form-group">
                                <label htmlFor="name_field">Name</label>
                                <input
                                    type="text"
                                    id="name_field"
                                    className="form-control"
                                    {...register('name')}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control"
                                    {...register('email')}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone_field">Phone</label>
                                <input
                                    type="text"
                                    id="phone_field"
                                    className="form-control"
                                    {...register('phone')}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="street_field">Street</label>
                                <input
                                    type="text"
                                    id="street_field"
                                    className="form-control"
                                    {...register('street')}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apartment_field">Apartment</label>
                                <input
                                    type="text"
                                    id="apartment_field"
                                    className="form-control"
                                    {...register('apartment')}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zip_field">Zip</label>
                                <input
                                    type="text"
                                    id="zip_field"
                                    className="form-control"
                                    {...register('zip')}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city_field">City</label>
                                <input
                                    type="text"
                                    id="city_field"
                                    className="form-control"
                                    {...register('city')}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="country_field">Country</label>
                                <input
                                    type="text"
                                    id="country_field"
                                    className="form-control"
                                    {...register('country')}
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='image_upload'>Image</label>
                                <div className='d-flex align-items-center'>
                                    <div>
                                        <figure className='avatar mr-3 item-rtl'>
                                            <img
                                                src={avatarPreview}
                                                className='rounded-circle'
                                                alt='Avatar Preview'
                                            />
                                        </figure>
                                    </div>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='image'
                                            className='custom-file-input'
                                            id='customFile'
                                            accept='image/*'
                                            {...register('image')}
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-block mt-4 mb-3"
                                style={{ backgroundColor: 'green', color: 'white', display: 'block', margin: '0 auto' }}
                                disabled={loading}
                            >
                                Confirm
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateProfile;