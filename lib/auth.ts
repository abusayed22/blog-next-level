import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: "abusayed.in22@gmail.com",
        pass: process.env.APP_PASSWORD!,
    },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    // O-AUTH 
    socialProviders: {
        google: { 
            prompt: "select_account consent",
            accessType:"offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },
    emailVerification: {
        autoSignInAfterVerification: true, 
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`
            try {
                const info = await transporter.sendMail({
                    from: '"next-level-blog" <prisma@gmail.com>',
                    to: user.email,
                    subject: "Hello ✔",
                    text: "Next-level-Blog email verification", // Plain-text version of the message
                    html: `
                    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f6f8;">
    <div style="max-width:600px; margin:40px auto; background:#ffffff; padding:30px; border-radius:8px;">
      
      <h2 style="color:#333;">Verify your email address</h2>
      
      <p style="color:#555; font-size:16px;">
        Thanks for signing up for <strong>Next Level Blog</strong>!
      </p>

      <p style="color:#555; font-size:16px;">
        Please use the verification code below to complete your registration:
      </p>

      <div style="margin:30px 0; text-align:center;">
        <span style="display:inline-block; font-size:24px; letter-spacing:4px; padding:15px 25px; background:#f0f2f5; border-radius:6px; color:#111;">
          ${verificationUrl}
        </span>
      </div>

      <p style="color:#777; font-size:14px;">
        If you did not create this account, you can safely ignore this email.
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:30px 0;" />

      <p style="color:#999; font-size:12px;">
        © 2026 Next Level Blog. All rights reserved.
      </p>
    </div>
  </body>
</html>

                    `,
                });

                console.log("Message sent:", info.messageId);
            } catch (error) {
                console.log(error!)
            }
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    trustedOrigins: [process.env.FRONTEND_URL!],
});