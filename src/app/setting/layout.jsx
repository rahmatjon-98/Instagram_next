'use client'
import React from 'react'
import Image from 'next/image'
import metaa from '../../assets/img/pages/auth/registration/metaa.png'
import { ALargeSmall, ArrowDownToLine, AtSign, Baby, BadgeCheck, Ban, Bell, BellOff, BookText, CircleOff, CircleStar, CircleUserRound, Crown, HeartOff, Languages, LifeBuoy, Lock, LockKeyhole, MessageCircleDashed, MessageCircleReply, RefreshCw, Repeat, ShieldCheck, ShieldPlus, SquareChartGantt, SquarePlay, User, UserRound, Users, UserX, Wallet } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const LayoutSet = ({ children }) => {
    const pathname = usePathname(); 
     const { t } = useTranslation();

    return (
        <div className='flex gap-[10px]'>
          <div className="h-screen w-[450px] p-[20px] overflow-y-auto scroll-smooth">


                <p className='font-semibold text-[22px]'>{t('setting.settings')}</p>

                <div className='p-4 w-[300px] mt-[20px] shadow-xl rounded-xl font-sans transition-transform duration-300 ease-in-out hover:scale-101'>
                    <Image
                        className="w-[100px] h-[110px] transition-transform duration-300 ease-in-out hover:scale-105"
                        src={metaa}
                        alt="meta"
                    />
                    <h2 className="text-lg font-semibold mb-3">{t('setting.center')}</h2>
                    <p className="text-sm text-gray-600 leading-snug">
                        {t('setting.desc')}
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
                        href="https://accountscenter.instagram.com/?entry_point=app_settings"
                        className="block mt-6 text-sm text-[#0095f6] hover:underline"
                    >
                        Больше настроек в Центре аккаунтов
                    </a>
                </div>

                <p className='font-semibold text-[15px] text-gray-600 w-[300px] mt-[30px]'>{t('setting.insta')}</p>

                <Link href={'/setting/pro'}>
                    <div
                        className={`flex  gap-[10px] items-center p-4 rounded-md mt-[20px] transition-colors duration-300
                        ${pathname === "/setting/pro" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                        <CircleUserRound />
                        <p>{t('setting.profile')}</p>
                    </div>
                </Link>
                <Link href={'/setting/likes'}>
                    <div
                        className={`flex gap-[10px] items-center p-4 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/likes" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                        <Bell />
                        <p>{t('setting.notification')}</p>
                    </div>
                </Link>
                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>{t('setting.content')}</p>
                <Link href={'/setting/block-account'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[15px] transition-colors duration-300
                        ${pathname === "/setting/block-account" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                        <Lock />
                        <p>Конфиденциальность <br /> аккаунта</p>
                    </div>
                </Link>
                <Link href={'/setting/blizki'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/blizki" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                        <CircleStar  />
                        <p>Близкие друзья</p>
                    </div>
                </Link>
                <Link href={'/setting/block'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/block" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                        <Ban />
                        <p>Заблокированные</p>
                    </div>
                </Link>
                <Link href={'/setting/story'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/story" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                       <CircleOff />
                        <p>Скрыть историю</p>
                    </div>
                </Link>
                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>Взаимодействие с вами</p>
                <Link href={'/setting/message'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[15px] transition-colors duration-300
                        ${pathname === "/setting/message" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                       <MessageCircleReply />
                        <p>Сообщения и ответы на <br /> истории</p>
                    </div>
                </Link>
                <Link href={'/setting/upr'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/upr" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                       <AtSign />
                        <p>Метки и упоминания</p>
                    </div>
                </Link>
                <Link href={'/setting/comment'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/comment" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                       <MessageCircleDashed />
                        <p>Комментарии</p>
                    </div>
                </Link>
                <Link href={'/setting/repost'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/repost" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                       <Repeat />
                        <p>Репосты и повторное <br /> использование</p>
                    </div>
                </Link>
                <Link href={'/setting/RestrictedAccount'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/RestrictedAccount" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                       <UserX />
                        <p>Аккаунты с ограничениями</p>
                    </div>
                </Link>
                <Link href={'/setting/words'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/words" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                       <ALargeSmall />
                        <p>Скрытые слова</p>
                    </div>
                </Link>
                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>Что вы видите</p>
                <Link href={'/setting/accountes-block'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[15px] transition-colors duration-300
                        ${pathname === "/setting/accountes-block" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                       <BellOff />
                        <p>Скрытые аккаунты</p>
                    </div>
                </Link>
                <Link href={'/setting/setContent'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/setContent" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                       <SquarePlay />
                        <p>Настройки контента</p>
                    </div>
                </Link>
                <Link href={'/setting/heart'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/heart" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                       <HeartOff />
                        <p>Число отметок "Нравится" <br /> и репостов</p>
                    </div>
                </Link>
                <Link href={'/setting/corol'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/corol" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                       <Crown />
                        <p>Платные подписки</p>
                    </div>
                </Link>
                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>Ваше приложение и медиафайлы</p>
                <Link href={'/setting/download'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[15px] transition-colors duration-300
                        ${pathname === "/setting/download" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                       <ArrowDownToLine />
                        <p>Архивирование и <br /> скачивание</p>
                    </div>
                </Link>
                <Link href={'/setting/baby'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/baby" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                      <Baby />
                        <p>Специальные возможности</p>
                    </div>
                </Link>
                <Link href={'/setting/language'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/language" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                      <Languages />
                        <p>Язык</p>
                    </div>
                </Link>
                <Link href={'/setting/sayt'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/sayt" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                      <Wallet />
                        <p>Разрешения сайта</p>
                    </div>
                </Link>
                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>Семьям</p>
                <Link href={'/setting/family'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/family" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                      <Users />
                        <p>Семейный центр</p>
                    </div>
                </Link>
                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>Для профессиональных аккаунтов</p>
                <Link href={'/setting/accountType'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[15px] transition-colors duration-300
                        ${pathname === "/setting/accountType" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                      <SquareChartGantt />
                        <p>Тип аккаунта и <br /> инструменты</p>
                    </div>
                </Link>
                <Link href={'/setting/show'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/show" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                      <BadgeCheck />
                        <p>Покажите, что ваш <br /> профиль подтвержден</p>
                    </div>
                </Link>

                <p className='font-semibold text-[15px] text-gray-600 mt-[30px]'>Информация и поддержка</p>
                <Link href={'/setting/help'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[15px] transition-colors duration-300
                        ${pathname === "/setting/help" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                      <LifeBuoy />
                        <p>Помощь</p>
                    </div>
                </Link>
                <Link href={'/setting/center'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/center" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                      <ShieldPlus />
                        <p>Центр <br /> конфиденциальности</p>
                    </div>
                </Link>
                <Link href={'/setting/statusAccount'}>
                    <div
                        className={`flex gap-[10px] items-center p-3 rounded-md mt-[5px] transition-colors duration-300
                        ${pathname === "/setting/statusAccount" ? "bg-gray-300" : "hover:bg-gray-200"}`}
                    >
                      <UserRound />
                        <p>Статус аккаунта</p>
                    </div>
                </Link>
            </div>

            <div className='w-[1000px]'>
                {children}
            </div>
        </div>
    )
}

export default LayoutSet
