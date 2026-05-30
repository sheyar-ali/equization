// middleware/admin.js – Redirect non-admin users
export default function ({ store, redirect, localePath }) {
  const token = store.state.token || (process.client ? localStorage.getItem('token') : null);
  if (!token) return redirect(localePath('/signin'));

  const user = store.state.user;
  if (!user || user.role !== 'admin') {
    return redirect(localePath('/'));
  }
}
