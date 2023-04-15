import React, {useContext, useState} from 'react';
import {BsListCheck} from 'react-icons/bs';
import {HiOutlinePlus} from 'react-icons/hi';
import {VscClose} from 'react-icons/vsc';
import {IoIosCloseCircleOutline} from 'react-icons/io';
import {dataColors} from "../../../utils/dataColors";
import {v4 as uuidv4} from 'uuid';
import axios from "axios";
import {CustomContext} from "../../../utils/Context";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Aside = () => {
    const {user, setUser, status, setStatus} = useContext(CustomContext)
    const [active, setActive] = useState(false)
    const [color, setColor] = useState(dataColors[0])
    const [category, setCategory] = useState('')
    const categoryAdd = () => {
        let newCategory = {
            categoryName: category,
            id: uuidv4(),
            color,
            tasks: [],
        }
        axios.patch(`http://localhost:8080/users/${user.id}`, {categories: [...user.categories, newCategory]})
            .then(({data}) => {
                setUser({
                    ...data,
                    token : user.token
                })
                localStorage.setItem('user', JSON.stringify({
                    ...data,
                    token : user.token
                }))
                setActive(false)
                setCategory('')
                toast("Папка добавлена")
            })
            .catch((err) => toast(`Папка не добавлена, ${err.message}`))

    }

    const logOutUser = () => {
        localStorage.removeItem('user')
        setUser({
            email: ''
        })

    }

    const checkCategories = () => {
        if(user.categories.findIndex((item) => item.categoryName === category) > -1) {
            toast('Такая папка уже есть')
        } else {
            categoryAdd()
        }
    }
    const delFolder = (id) => {
        let newArrayCategory = user.categories.filter((item) => item.id !== id)
        axios.patch(`http://localhost:8080/users/${user.id}`, {categories: newArrayCategory })
            .then(({data}) => {
                setUser({
                    ...data,
                    token : user.token
                })
                localStorage.setItem('user', JSON.stringify({
                    ...data,
                    token : user.token
                }))
                toast("Папка удалена")
            }).catch((err) => toast(`Папка не удалена, ${err.message}`))
    }

    return (
        <aside className='aside'>
            <button onClick={logOutUser} className='aside__leave'>
                Exit
            </button>
            <div onClick={() => setStatus('all')} className={`aside__all ${status === 'all' ? 'active' : ''}`}>
                <span>
                    <BsListCheck/>
                </span>
                <span className='aside__text'>Все задачи</span>
            </div>
            <ul className='aside__menu'>
                {
                    user.categories.map((item) => (
                        <li onClick={() => setStatus(item.categoryName)} key={item.id} className={`aside__item ${status === item.categoryName ? 'active' : ' '}`}>
                            <span style={{background: item.color}} className='aside__color'></span>
                            <span className='aside__text'>{item.categoryName}</span>
                            <span onClick={() => delFolder(item.id)} className='aside__item-del'><VscClose/></span>
                        </li>
                        ))
                }

            </ul>
            <div style={{position: 'relative'}}>
                <div onClick={() => setActive(prev => !prev)} className='aside__create'>
                <span>
                    <HiOutlinePlus/>
                </span>
                    <span className='aside__text'>Добавить папку</span>

                </div>

                <div style={{display: active ? 'block' : 'none'}} className='aside__popup'>
                    <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder='Название папки'
                           type="text" className="aside__input"/>
                    <div className='aside__colors'>
                        {dataColors.map((item) => (
                            <span onClick={() => setColor(item)} className="aside__col" key={item}
                                  style={{background: item, border: color === item ? '3px solid #525252' : 'none'}}/>
                        ))}
                    </div>
                    <button onClick={checkCategories} type='button' className='aside__add'>Добавить</button>
                    <span className='aside__popup-close'>
                        <IoIosCloseCircleOutline onClick={() => setActive(false)}/>
                    </span>
                </div>
            </div>

        </aside>
    );
};

export default Aside;