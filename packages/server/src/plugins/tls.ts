import Elysia from "elysia";

const cert = process.env["SSL_CERT"];
const key = process.env["SSL_KEY"];
export const TLS = () =>
    new Elysia({
        serve: {
            tls: {
                key: Bun.file(key!),
                cert: Bun.file(cert!),
            },
        },
    });
