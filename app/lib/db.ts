import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// async function test(){
//     const result = await db.uSER.create({
//         data: {
//             USER_NAME : "테스트",
//         }
//     });
//     console.log(result);
// }

export default db;