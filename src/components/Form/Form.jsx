import React, {useContext} from 'react';
import {Link, useNavigate, useLocation, Navigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import axios from "axios";
import {CustomContext} from "../../utils/Context";

const Form = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const {setUser, user} = useContext(CustomContext)

    const {
        register,
        reset,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm(
        { mode: "onBlur"}
    )

    const registerUser =  (data) => {
        axios.post('http://localhost:8080/register' , {
            ...data,
            categories: []
        }).then((res) => {
            setUser({
                token: res.data.accessToken,
                ...res.data.user
            })
            localStorage.setItem('user', JSON.stringify({
                token: res.data.accessToken,
                ...res.data.user
            }))
            reset()
            navigate('/')

        })
            .catch((err) => console.log(err))
    }
    const loginUser =  (data) => {
        axios.post('http://localhost:8080/login' , {
            ...data,
            categories: []
        }).then((res) => {
            setUser({
                token: res.data.accessToken,
                ...res.data.user
            })
            localStorage.setItem('user', JSON.stringify({
                token: res.data.accessToken,
                ...res.data.user
            }))
            reset()
            navigate('/')

        })
            .catch((err) => console.log(err))
    }

    const onSubmit = (data) => {
        location.pathname === '/register' ? registerUser(data) : loginUser(data)

    }

    if (user.email.length !== 0) {
        return <Navigate to='/'/>
    }

    return (
        <form noValidate className="form" onSubmit={handleSubmit(onSubmit)}>
            <h2 className='form__title'>
                {
                    location.pathname === '/register' ? 'Регистрация' : 'Вход'
                }
            </h2>
            {
                location.pathname === '/register' ? <label className="form__label">
                    <input {...register('login', {
                        required : {
                            message : 'заполните',
                            value : true
                        },
                        maxLength : {
                            message : 'max 10 сим',
                            value : 10
                        },
                        minLength : {
                            message : "min 3 let",
                            value : 3
                        }

                    })} className="form__filed" type="text" placeholder='Введите логин'/>
                    <span className="form__desc">{errors.login && errors.login.message}</span>
                </label> : ''
            }
            <label className="form__label">
                <input {...register('email', {
                    required : {
                        message : 'Email is required',
                        value : true
                    },
                    minLength : {
                        message : "min 3",
                        value : 3
                    },
                    pattern : {
                        message : 'напишите праилна email',
                        value : /^[^ ]+@[^ ]+\.[a-z]{2,5}$/

                    }
                })} className="form__filed" type="email" placeholder='Введите Email'/>
                <span className="form__desc">{errors.email && errors.email.message}</span>
            </label>
            <label className="form__label">
                <input {...register('password', {
                    required : {
                        message : 'Please enter your password',
                        value : true
                    },
                    pattern : {
                        message : 'password 8 sim',
                        value : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                    }
                })} className="form__filed" type="password" placeholder='Введите пороль'/>
                <span className="form__desc">{errors.password && errors.password.message}</span>
            </label>
            {
                location.pathname === 'register' ?
                    <label className="form__label">
                        <input className="form__filed" type="password" placeholder='Введите пороль еще раз'/>
                        <span className="form__desc">{errors.login && errors.login.message}</span>
                    </label> :''
            }



            <button className="form__btn" type='submit'>
                {
                    location.pathname === '/register' ? 'Зарегистрироваться' : 'Войти'
                }
            </button>
            <p className="form__text">
                {
                    location.pathname === '/register' ?
                        <>У меня уже есть акаунт чтобы <Link className="form__link" to="/login">войти</Link></>
                        : <>Еще нет акаунта ? <Link to='/register'>Зарегистрироваться</Link></>
                }
                </p>
        </form>
    );
};

export default Form;