import { Body, Head, Heading, Html, Link, Preview, Section, Tailwind, Text } from "@react-email/components";
import * as React from "react"

interface  AccountDeletionTemplateProps {
    domain:string
}


export function AccountDeletionTemplate({domain}:AccountDeletionTemplateProps){
   const registerLink=`${domain}(account/create)`
   
    return(
        <Html>
            <Head/>
            <Preview>Account elliminato</Preview>
       
       <Tailwind>
        <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
            <Section className="text-center">
                <Heading className="text-3xl text-black font-bold">Vostro account eliminato</Heading>
                <Text className="text-base text-black mt-2">Dati del vosto account stati eliminati definitamente</Text>
            </Section>
            <Section className="bg-white text-black text-center rounded-lg shodow-md p-6 mb-4">
                <Text>Non riceverete piu messagi in Telegram e via email</Text>
                <Text>Per tornare sulla piataforma, pottete registrarvi seguendo link.</Text>
          <Link href={registerLink} className="inline-flex jusitfy-center items-center rounded-md mt-2 text-sm font-medium text-white bg-[#18B9AE] px-5 py-2 rounded-full">Registrati su Creesestream</Link>
            </Section>
            <Section className="text-center text-black">
                <Text className="">Grazie per essere stato con noii. saremo sepre felice a vedervi sulla nostra piataforma</Text>
            </Section>
        </Body>
       </Tailwind>
        </Html>
    )
}