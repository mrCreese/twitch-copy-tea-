import type { SessionMetadata } from '@/src/shared/types/session-metadata.types'
import * as React from 'react'
import { Html } from '@react-email/html';
import { Body, Head, Heading, Link, Preview, Section, Tailwind, Text } from '@react-email/components';



interface DeactivateTemplateProps {
    token:string
    metadata: SessionMetadata
}


export default function DeactivateTemplate({token,metadata}:DeactivateTemplateProps) {
  return (
  <Html>
            <Head/>
            <Preview>Deactive Account</Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'>
                        <Heading className='text-3xl text-black font-bold'>
                            Deactive Account
                        </Heading>
                        <Text className='text-base text-black'>
                            Iniziato proccesso deactiveazione account                 
                        </Text>
                       <Section className='bg-gray-100 rounded-lg p-6 text-center mb-6'>
                        <Heading className='text-2xl text-black font-semibold'>Codice conferma:</Heading>
                        <Heading className='text-3xl text-black font-semibold'>{token}</Heading>
                        <Text className='text-black'>Codice valido 5 minuti</Text>
                       </Section>
                
                    </Section>

                    <Section className='bg-gray-100 rounded-lg p-6 mb-6'>
                        <Heading className='text-xl font-semibold text-[#18B9AE]'>
                            Info della richiesa:
                        </Heading>
                        <ul className='list-disc list-inside text:black mt-2'>
                            <li>Locazia: {metadata.location.country}</li>
                            <li>Sistema operativo: {metadata.device.os}</li>
                            <li>Browser: {metadata.device.browser}</li>
                            <li>Ip-indirizzo: {metadata.ip}</li>
                        </ul>
                        <Text className='text-gray-600 mt-2'>
                            Se non sei stato tu a richiedere, Ignora questa email
                        </Text>
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
