import nodemailer from "nodemailer";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

type ContactBody = {
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
};

export async function POST(req: Request) {
  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !phone || !message) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: requiredEnv("SMTP_HOST"),
      port: Number(requiredEnv("SMTP_PORT")),
      secure: String(process.env.SMTP_SECURE ?? "false") === "true",
      auth: {
        user: requiredEnv("SMTP_USER"),
        pass: requiredEnv("SMTP_PASS"),
      },
    });

    const from =
      process.env.SMTP_FROM || `TetClima <${requiredEnv("SMTP_USER")}>`;
    const to = "mnikovwork@gmail.com";

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: `Контакт форма: ${subject || "Ново съобщение"}`,
      text: [
        "Ново съобщение от контакт формата",
        "",
        `Име и фамилия: ${name}`,
        `Телефон: ${phone}`,
        `Email: ${email}`,
        `Относно: ${subject || "-"}`,
        "",
        "Съобщение:",
        message,
      ].join("\n"),
    });

    return new Response("OK", { status: 200 });
  } catch (e: any) {
    return new Response(e?.message || "Failed to send email", { status: 500 });
  }
}

