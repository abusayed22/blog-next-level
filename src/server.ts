import { prisma } from "../lib/prisma"
import { app } from "./app";


const main = () => {
    try {
        prisma.$connect();

        console.log("Connented to Database Successfully!");
        app.listen(process.env.PORT||5000,() => {
            console.log(`Server is Successfully running on ${process.env.PORT || 5000}`)
        })
    } catch (error) {
        console.log({error})
        prisma.$disconnect();
        process.exit(1);
    }
}

main();
