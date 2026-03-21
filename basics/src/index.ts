// import { createServer } from 'http';
// import fs from "fs"

// const PORT = 8000;

// const server = createServer((req, res) => {
//     // console.log(req.url, req.method, req.headers);

//     if (req.url === '/' && req.method === 'GET') {
//         res.setHeader('Content-Type', 'text/html');
//         res.end(`
//             <html>
//                 <head><title>Node Form</title></head>
//                 <body>
//                     <form action="/message" method="POST">
//                         <input type="text" name="message" />
//                         <button type="submit">Submit</button>
//                     </form>
//                 </body>
//             </html>
//         `);
//         return;
//     }

//     if (req.url === '/message' && req.method === 'POST') {
//         const body: Buffer[] = [];
//         req.on('data', (chunk) => {
//             body.push(chunk);
//         });
//         req.on('end', () => {
//             const parsedBody = Buffer.concat(body).toString();
//             const message = parsedBody.split("=")[1] || ""
//             console.log(message);
//             fs.writeFileSync("message.txt", message)
//             res.statusCode = 302;
//             res.setHeader('Location', '/');
//             res.end();
//         });
//         return;
//     }

//     res.statusCode = 404;
//     res.setHeader('Content-Type', 'text/html');
//     res.end('<h1>Not Found</h1>');
// });

// server.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}/`);
// });

import express from "express";
import path from "path";
import dotenv from "dotenv"
import { router as adminRouter } from "./routes/admin.js";
import { router as shopRouter } from "./routes/shop.js";
import { router as userRouter } from "./routes/users.js";
import { rootDir } from "./utils/path.js";

dotenv.config()

const app = express();
const PORT = 8000;

app.set("view engine", "pug");
app.set("views", path.join(rootDir, "../", "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use("/", shopRouter);
app.use(express.static(path.join(rootDir, "../", "public")));

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(rootDir, "../", "views", "404.html"));
});

app.listen(PORT, () => {
    console.log(`Express server is running at http://localhost:${PORT}`);
});