import * as React from "react"
import { Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from "@react-email/components";

interface EnambleTwoFactorTemplateProps {
    domain:string
}


export function EnableTwoFacttorTemplate({domain}:EnambleTwoFactorTemplateProps) {
const settingsLink=`${domain}/dashboard/settings`
    return(
        <Html>
            <Head/>
            <Preview>Aumenta la tua sicurezza</Preview>
            <Tailwind>
                <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
                <Section className="text-center mb-8">
                        <Heading className="text-3xl text-black font-bold">
                            Difendi tuo account con autenticazione a due fattori
                        </Heading>
                        <Text className="text-black text-base mt-2">
                            Attiva l'autenticazione a due fattori, per aumentare livelo di sicurezza
                        </Text>
                </Section>
                <Section className="bg-white rounded-lg shadow-md p-6 text-center mb-6">
                        <Heading className="text-2xl text-black font-semibold">
                            Perchè importante?
                        </Heading>
                        <Text className="text-black text-base mt-2">
                            Autenticazione a due fattori aggiunge ulteriore livelo di protezione, richiede codice, che conosci solo te.
                        </Text>
                        <Link
                             href={settingsLink}
                             className="inline-flex justify-center items-center rounded-md text-sm font-medium text-white bg-[#18B9AE] px-5 py-2 rounded-full"
                        >
                            Impostazioni account
                        </Link>
                </Section>
                <Section className="text-center mt-8">
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
