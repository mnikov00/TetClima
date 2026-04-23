import nodemailer from "nodemailer";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

type InquiryBody = {
  fullName: string;
  phone: string;
  email: string;
  product: {
    id: string;
    title: string;
    url: string;
  };
};

export async function POST(req: Request) {
  let body: InquiryBody;
  try {
    body = (await req.json()) as InquiryBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const fullName = String(body.fullName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const productTitle = String(body.product?.title ?? "").trim();
  const productUrl = String(body.product?.url ?? "").trim();

  if (!fullName || !phone || !email || !productTitle || !productUrl) {
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
      subject: `Ново запитване за продукт: ${productTitle}`,
      text: [
        "Ново запитване за продукт",
        "",
        `Продукт: ${productTitle}`,
        `Линк: ${productUrl}`,
        "",
        `Име и Фамилия: ${fullName}`,
        `Телефон: ${phone}`,
        `Email: ${email}`,
      ].join("\n"),
    });

    return new Response("OK", { status: 200 });
  } catch (e: any) {
    return new Response(e?.message || "Failed to send email", { status: 500 });
  }
}

