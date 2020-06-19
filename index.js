import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

const movies = new Map();
movies.set("1", {
    id: "1",
    title: 'the deno land',
    publisher: 'Ryan dahl'
});


const router =  new Router();

router  
    .get('/api',(ctx) =>{
        ctx.response.body = "Api is working";
    })
    .get('/api/movies', (ctx) => {
        ctx.response.body = Array.from(movies.values());
    })
    .get('/api/movies/:id',(ctx) => {
        if (ctx.params && ctx.params.id && movies.has(ctx.params.id)) {
            ctx.response.body = movies.get(ctx.params.id);
        }
    })
    .post('/api/movies', async (ctx) => {
        const body = await ctx.request.body();
        const values = body.value;
        movies.set(values.id, {...values});
        ctx.response.body = Array.from(movies.values());
    })
    .patch("/api/movies/:id", async (ctx) =>{
        if (ctx.params && ctx.params.id && movies.has(ctx.params.id)) {
            const body = await ctx.request.body();
            const title = body.value.title;
            movies.get(ctx.params.id).title = title;
            ctx.response.body = movies.get(ctx.params.id);
        }
    })
    .delete("/api/movies/:id", async (ctx) =>{
        if (ctx.params && ctx.params.id && movies.has(ctx.params.id)) {
            movies.delete(ctx.params.id);
        }
        ctx.response.body = Array.from(movies.value());
    })

app.use(async (ctx, next) => {
    await next();
    console.log(`${ctx.request.method} ${ctx.request.url}`);
});

app.use(router.routes());
app.use(router.allowedMethods())

// app.use((ctx) => {
//   ctx.response.body = "Hello World!";
// });

await app.listen({ port: 8000 });