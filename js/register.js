// Handles registration form submission and writes to Supabase (public anon key with RLS).
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#register-form');
  const statusEl = document.querySelector('#register-status');

  // Replace with your Supabase project URL and anon key (safe to expose with RLS).
  const SUPABASE_URL = window.SUPABASE_URL || 'https://YOUR-PROJECT.supabase.co';
  const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'YOUR_PUBLIC_ANON_KEY';

  if (!form || !window.supabase) return;
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const setStatus = (message, type = '') => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('', '');

    const payload = {
      first_name: form.firstName.value.trim(),
      last_name: form.lastName.value.trim(),
      email: form.email.value.trim(),
    };

    if (!payload.first_name || !payload.last_name || !payload.email) {
      setStatus('Please fill in all fields.', 'error');
      return;
    }

    try {
      const { error } = await supabaseClient.from('registrations').insert(payload);
      if (error) throw error;
      setStatus('Registration saved. Thank you!', 'success');
      form.reset();
    } catch (err) {
      setStatus('Could not save your registration. Please try again.', 'error');
      console.error(err);
    }
  });
});
