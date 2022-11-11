// Using NextJS and TypeScript

// ./pages/api/contact.ts
import { NextApiRequest, NextApiResponse } from 'next';

import nodemailer from 'nodemailer';

const email = process.env.EMAIL_ADDRESS;
const emailPass = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: email,
    pass: emailPass,
  },
});

interface MailerProps {
  senderMail: string;
  name: string;
  text: string;
}

const mailer = ({ senderMail, name, text }: MailerProps) => {
  const from = name && senderMail ? `${name} <${senderMail}>` : `${name || senderMail}`;

  const message = {
    from,
    to: `${email}`,
    subject: `Nova mensagem de contato - ${name}`,
    text,
    replyTo: from,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, info) => {
      // error e info são callbacks para possíveis problemas
      error ? reject(error) : resolve(info);
    });
  });
};

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const { senderMail, name, content } = request.body; // dados que vêm do front-end

  if (!senderMail || !name || !content) {
    // se não encontrar os campos preenchidos, devolve um json com a mensagem
    response.status(403).json({ message: 'Please fill out all the fields.' });
    return;
  }

  const mailerResponse = await mailer({ senderMail, name, text: content });
  response.send(mailerResponse);
};


// ../../utils/sendMail.ts
import axios from 'axios';

export const sendContactMail = async (name: string, senderMail: string, content: string) => {
  const data = {
    name,
    senderMail,
    content,
  };

  try {
    return await axios.post('/api/contact', data);
  } catch (error) {
    return error;
  }
};
