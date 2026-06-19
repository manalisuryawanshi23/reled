import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Mail, Trash2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New User Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('editor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { session, user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [session]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ email: newEmail, password: newPassword, role: newRole })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      
      setUsers([data, ...users]);
      setIsAdding(false);
      setNewEmail('');
      setNewPassword('');
      setNewRole('editor');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      
      setUsers(users.filter(u => u.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loader" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Users & Roles</h1>
          <p className="text-dark-500">Manage dashboard access and permissions.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          {isAdding ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Create New User</h2>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="Min 6 characters"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="input-label">Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="input-field"
              >
                <option value="editor">Editor (No User/Settings Access)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full h-[42px]">
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                        {u.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="font-medium text-dark-900">{u.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Shield className="w-3.5 h-3.5" />
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.id === currentUser?.id}
                      className={`p-2 rounded-lg transition-colors ${
                        u.id === currentUser?.id 
                          ? 'text-slate-300 cursor-not-allowed' 
                          : 'text-red-500 hover:bg-red-50'
                      }`}
                      title={u.id === currentUser?.id ? "Cannot delete yourself" : "Delete user"}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
