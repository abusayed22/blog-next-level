import { prisma } from "../../lib/prisma";
import { RoleEnum } from "../middleware/auth/authMiddleware";

const seedAdmin = async () => {
    try {
        const adminData = {
            name: "Admin2 Saheb",
            email: "admin20@admin.com",
            role: RoleEnum.ADMIN,
            password: "admin1234"
        }

        // check the email exists
        const existingUser = await prisma.user.findUnique({
            where: { email: adminData.email }
        });

        console.log("************ chechking user existing")
        if (existingUser) {
            console.log("Admin user already exists. Skipping seeding.");
            return console.error("Admin user already exists. Skipping seeding.");
        };

        // create admin user 
        // TODO: have a issue when we create user directly using prisma client, because we have hash password in the sign-up api.
        const createAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Origin: "http://localhost:3000",
            },
            body: JSON.stringify(adminData)
        });

        console.log(createAdmin);

        if(createAdmin.ok){
            console.log("Admin created successfully");
            await prisma.user.update({
                where: {email: adminData.email},
                data: {emailVerified: true}
            })
            console.log("Admin email verifying...")
        }

        console.log("The Admin user email verifyed.")

    } catch (error) {
        console.log(error)
    }
}


seedAdmin();