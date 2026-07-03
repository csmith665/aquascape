'use client';

import { useState } from 'react';
import { deleteProject } from './actions';

export function DeleteBuildButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);

  function handleSubmit(formData: FormData) {
    if (!confirm('Delete this build? This cannot be undone.')) return;
    setPending(true);
    deleteProject(formData);
  }

  return (
    <form action={handleSubmit} style={{ padding: '0 1.75rem 1.75rem' }}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="btn btn-secondary"
        style={{ width: '100%', fontSize: '0.85rem', padding: '0.5rem 1rem', background: '#f5c6cb', color: '#4a0d12' }}
      >
        {pending ? 'Deleting...' : 'Delete Build'}
      </button>
    </form>
  );
}
