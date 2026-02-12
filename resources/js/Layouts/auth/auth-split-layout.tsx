import React, { useState, useEffect } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

// Mensajes aleatorios para el login
const MESSAGES = [
    { title: 'Grábalo en la memoria', subtitle: 'Tu talento es la chispa que enciende este equipo' },
    { title: 'Grábalo en la memoria', subtitle: 'Tu dedicación hace posible nuestra agenda cultural' },
    { title: 'Grábalo en la memoria', subtitle: 'Gracias por ser parte de este sueño' },
    { title: 'Grábalo en la memoria', subtitle: 'Nuestro equipo brilla gracias a ti' },
    { title: 'Grábalo en la memoria', subtitle: 'Cada cliente vale más que una paella valenciana' },
    { title: 'Grábalo en la memoria', subtitle: 'Ni con diez naranjas de Nules encuentras tanta energía' },
    { title: 'Grábalo en la memoria', subtitle: 'Con más ritmo que las mascletaes de la Magdalena' },
    { title: 'Grábalo en la memoria', subtitle: 'Con más chispa que una falla en marzo' },
    { title: 'Grábalo en la memoria', subtitle: 'Con más sabor local que una tapa de bravas' },
];

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage<SharedData>().props;
    const [randomMsg, setRandomMsg] = useState(MESSAGES[0]);

    useEffect(() => {
        const idx = Math.floor(Math.random() * MESSAGES.length);
        setRandomMsg(MESSAGES[idx]);
    }, []);

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Panel izquierdo con fondo mejorado */}
            <div
                className="relative hidden h-full flex-col p-10 text-white lg:flex bg-center bg-cover bg-no-repeat dark:border-r"
                style={{
                    backgroundImage: 'url("https://backend.grabaloapp.com/storage/settings/October2023/MJhLt0Iwa5HBlWI8P7lm.jpg")',
                }}
            >
                {/* Gradiente de overlay para mejorar lectura */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/70 to-black/20" />

                <div className="relative z-20 mt-auto space-y-4">
                    <blockquote className="space-y-2">
                        <p className="text-lg">&ldquo;{randomMsg.subtitle}&rdquo;</p>
                        <footer className="text-sm text-neutral-300">{randomMsg.title}</footer>
                    </blockquote>
                    {/*<p className="text-2xl font-extrabold tracking-wide">{randomMsg.title}</p>*/}
                    {/*<p className="text-lg text-neutral-200">{randomMsg.subtitle}</p>*/}
                </div>
            </div>

            {/* Panel derecho con formulario */}
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center">
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                    </Link>

                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-muted-foreground text-sm text-balance">{description}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
