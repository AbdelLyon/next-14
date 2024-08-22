import nodemailer from "nodemailer";
import pug from "pug";

export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { SMPT_EMAIL, SMTP_USER, SMTP_PASS } = process.env;

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    const sendResult = await transport.sendMail({
      from: SMPT_EMAIL,
      to,
      subject,
      html: body,
    });
    return sendResult;
  } catch (e) {
    console.error(e);
  }
}

export function compileActivationTemplate(name: string, url: string) {
  return pug.renderFile("src/mail/templates/activate.pug", {
    name,
    url,
  });
}
