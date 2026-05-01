import nodemailer from "nodemailer";
import { randomUUID } from "node:crypto";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

type InquiryBody = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  product: {
    id: string;
    title: string;
    url: string;
  };
};

function formatBgDateTime(d: Date) {
  const fmt = new Intl.DateTimeFormat("bg-BG", {
    timeZone: "Europe/Sofia",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return fmt.format(d);
}

function isValidBgPhone(raw: string) {
  const s = String(raw || "").trim();
  if (!s) return false;
  const digits = s.replace(/[^\d]/g, "");
  if (digits.length < 9) return false;
  if (digits.startsWith("0")) return digits.length === 10;
  if (digits.startsWith("359")) return digits.length === 12;
  return digits.length >= 9 && digits.length <= 13;
}

export async function POST(req: Request) {
  let body: InquiryBody;
  try {
    body = (await req.json()) as InquiryBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const fullName = `${firstName} ${lastName}`.trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const productTitle = String(body.product?.title ?? "").trim();
  const productUrl = String(body.product?.url ?? "").trim();

  if (!firstName || !lastName || !phone || !email || !productTitle || !productUrl) {
    return new Response("Missing required fields", { status: 400 });
  }
  if (!isValidBgPhone(phone)) {
    return new Response("Invalid phone number", { status: 400 });
  }

  try {
    const requestId = randomUUID();
    const now = new Date();
    const nowBg = formatBgDateTime(now);

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
    // const to = "tetclima3@gmail.com";

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      // Add a unique token to prevent email clients (e.g. Gmail) from threading separate inquiries.
      subject: `Запитване от ${fullName} [${requestId.slice(0, 8)}]: ${productTitle}`,
      messageId: `<${requestId}@tetclima.local>`,
      date: now,
      headers: {
        "X-TetClima-Request-Id": requestId,
      },
      text: [
        "Ново запитване за продукт",
        "",
        `ID: ${requestId}`,
        `Дата и час: ${nowBg}`,
        "",
        `Продукт: ${productTitle}`,
        `Линк: ${productUrl}`,
        "",
        `Име: ${firstName}`,
        `Фамилия: ${lastName}`,
        `Телефон: ${phone}`,
        `Email: ${email}`,
      ].join("\n"),
    });

    return new Response("OK", { status: 200 });
  } catch (e: any) {
    return new Response(e?.message || "Failed to send email", { status: 500 });
  }
}

