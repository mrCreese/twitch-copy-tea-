import * as React from 'react';

import {
	Body,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

export function VerifyChannelTemplate() {

    return (
        <Html>
            <Head />
            <Preview>
                Tuo canale verificato
            </Preview>
            <Tailwind>
                <Body className='max-w-2xl mx-auto p-6 bg-slate-50'>
                    <Section className='text-center mb-8'>
                        <Heading className='text-3xl text-black font-bold'>
                            Congratulazioni! Tuo canale adesso è verificato
                        </Heading>
                        <Text className='text-black text-base mt-2'>
                           Siamo felici di annunciare che il tuo canale adesso è verificato e hai ricevuto gettone ufficiale.
                        </Text>
                    </Section>
                    <Section className='bg-white rounded-lg shadow-md p-6 text-center mb-6'>
                        <Heading className='text-2xl text-black font-semibold'>
                            Cosa significa?
                        </Heading>
                        <Text className='text-base text-black mt-2'>
                            Gettone di verifica certifica l'autenticità del tuo canale e migliora la fiducia degli spettatori.
                        </Text>
                    </Section>
                    <Section className='text-center mt-8'>
                       <Text className="text-gray-600">
                           Per risolvere ogni dubbio, contatta assistenza al indirizzo{" "}
                           <Link 
                               href="mailto:help@teasteamcreese.it"
                               className="text-[#18B9AE] underline"
                           >
                               help@teasteamcreese.it
                           </Link>
                        </Text>
                    </Section>
                </Body>
            </Tailwind>
        </Html>
    )
}
