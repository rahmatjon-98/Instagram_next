import React from 'react'
import Image from 'next/image'
import metaa from '../../assets/img/pages/auth/registration/metaa.png'
import { BookText, CircleUserRound, ShieldCheck, User } from 'lucide-react'
const LayoutSet = ({ children }) => {
    return (
        <div>
            <div className='flex'>
                <div>
                    <div className=" h-screen p-[20px]  bg-white overflow-y-auto scroll-smooth">
                        <p className='font-semibold text-[22px]'>Настройки</p>
                        <div className='p-2 w-[300px] h-[400px] mt-[20px] shadow-xl  border border-gray-300 rounded-xl font-sans transition-transform duration-300 ease-in-out  hover:scale-101'>
                            <Image
                                className="w-[100px] h-[110px] transition-transform duration-300 ease-in-out hover:scale-105"
                                src={metaa}
                                alt="meta"
                            />

                            <h2 className="text-lg font-semibold mb-3">Центр аккаунтов</h2>

                            <p className="text-sm text-gray-600  leading-snug">
                                Управляйте кросс-сервисными функциями и настройками аккаунтов на
                                платформах Meta.
                            </p>

                            <div className="mt-[20px]">
                                <div className="flex gap-[10px] items-center cursor-pointer hover:bg-gray-50 p-1 rounded-md">
                                    <User />
                                    <span className="text-base">Личная информация</span>
                                </div>
                                <div className="flex gap-[10px] items-center cursor-pointer hover:bg-gray-50 p-1 rounded-md">
                                    <ShieldCheck />
                                    <span className="text-base">Пароль и безопасность</span>
                                </div>
                                <div className="flex gap-[10px] items-center cursor-pointer hover:bg-gray-50 p-1 rounded-md">
                                    <BookText />
                                    <span className="text-base">Рекламные предпочтения</span>
                                </div>
                            </div>

                            <a
                                href="#"
                                className="block mt-6 text-sm text-[#0095f6] hover:underline"
                            >
                                Больше настроек в Центре аккаунтов
                            </a>
                        </div>

                        <div>
                            <p className='font-semibold text-[15px] text-gray-600 text-center mt-[30px]'>Как вы используете Instagram</p>
                            <div>
                                <CircleUserRound />
                                <p>Редактировать профиль</p>
                            </div>
                        </div>



                    </div>



                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default LayoutSet