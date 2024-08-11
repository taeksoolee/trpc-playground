type User = { id: number; name: string };

const users: User[] = [];
export const db = {
  user: {
    findMany: async () => users,
    findById: async (id: number) => users.find((user) => user.id === id),
    create: async (data: { name: string }) => {
      const user = { id: users.length + 1, ...data };
      users.push(user);
      return user;
    },
  },
};