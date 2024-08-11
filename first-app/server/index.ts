// import { createHTTPServer } from '@trpc/server/adapters/standalone';
import * as trpcExpress from '@trpc/server/adapters/express';
import { z } from 'zod';
import cors from 'cors';
import { publicProcedure, router } from './trpc';
import { db } from './db';
import e from 'express';

const appRouter = router({
  userList: publicProcedure
    .query(async () => {
      const users = await db.user.findMany();
      return users;
    }),
  userById: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      const user = await db.user.findById(input);
      return user;
    }),
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const user = await db.user.create(input);
      return user;
    }),
});

export type AppRouter = typeof appRouter;

const app = e();

app.use(cors());

// const server = createHTTPServer({
//   router: appRouter,
//   middleware: cors(),
// });

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;

app.use(
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);


app.listen(3000);