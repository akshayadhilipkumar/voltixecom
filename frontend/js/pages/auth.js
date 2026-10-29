// ============ pages/auth.js : LOGIN + SIGNUP ============
Router.register('/login', async (app, q) => {
  const signup = q.mode === 'signup';
  app.innerHTML = `
    <form class="card form" id="authForm">
      <h2>${signup ? 'Create your account' : 'Welcome back'}</h2>
      ${signup ? '<input name="name" placeholder="Full name" required />' : ''}
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password (min 6 characters)" required minlength="6" />
      <button class="btn">${signup ? 'Sign up' : 'Login'}</button>
      <a class="link" href="#/login${signup ? '' : '?mode=signup'}">
        ${signup ? 'Already have an account? Login' : 'New here? Create an account'}</a>
    </form>`;

  document.getElementById('authForm').onsubmit = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target));
    try {
      const { token, user } = await api(signup ? '/auth/register' : '/auth/login', { method: 'POST', body });
      setAuth(token, user);       // IMPORTANT: token ah localStorage la save panrom
      await refreshBadges();
      toast('Welcome, ' + user.name);
      location.hash = '#/';
    } catch (err) { toast(err.message); }
  };
});