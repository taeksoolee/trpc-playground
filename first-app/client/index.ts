import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from './../server';

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'same-origin',
        });
      },
    }),
  ],
});

const renderUserContainer = async () => {
  const users = await trpc.userList.query();
  const userContainer = document.querySelector('#userContainer');

  if (!userContainer) {
    throw new Error('no #userList');
  }

  userContainer.innerHTML = '';

  if (users.length === 0) {
    const span = document.createElement('span');
    span.textContent = 'No users found';
    userContainer.appendChild(span);
  } else {
    const ul = document.createElement('ul');
    users.forEach((user) => {
      const li = document.createElement('li');
      li.textContent = user.name;
      ul.appendChild(li);
    });
    userContainer.appendChild(ul);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  renderUserContainer();

  trpc.userById.query(1).then(console.log);

  const createUserForm = document.querySelector('form[name=createUserForm]');

  if (createUserForm === null) {
    throw new Error('no createUserForm');
  }

  createUserForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = this.name as HTMLInputElement;
    if (!name) {
      throw new Error('no name input');
    }

    try {
      await trpc.userCreate.mutate({
        name: name.value,
      });
      name.value = '';
      renderUserContainer();
    } catch (err) {
      console.error(err);
    }
  });
});