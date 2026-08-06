import * as React from 'react';

import { Html } from '@react-email/html';
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components';

interface VerificationTemplateProps {
	domain: string;
	token: string;
}

export function VerificationTemplate({
	domain,
	token,
}: VerificationTemplateProps) {
	const verificationLink = `${domain}/account/verify?token=${token}`;

    return (
        <Html>
            <Head/>
            <Preview>Account Verification</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'>
                        <Heading className='text-3xl text-black font-bold'>
                            Conferma Posta Eletronica
                        </Heading>
                        <Text className='text-base text-black'>Grazie per la registrazione!Per confermare posta eletronica clicare link sequente</Text>
                  <Link href={verificationLink} className='infline-flex justify-center items-center rounded-md text-sm font-medium text-white bg-[#18B9AE] px-5 py-2'>
                 Confermare registrazione
                  </Link>
                    </Section>
                    <Section className='text-center mt-8'>
                        <Text className='text-gray-600'>Per informazioni o domande scrivere a{" "}
                            <Link href='mailto:mr.creese@libero.it' className='text-[#18B9AE] underline'>mr.creese@libero.it</Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}
