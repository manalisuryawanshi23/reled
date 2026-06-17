import React, { useEffect, useState } from 'react';
import { Search, Eye, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Enquiry } from '../../lib/types';

export function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setEnquiries(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('enquiries').update({ status }).eq('id', id);
    fetchEnquiries();
    if (selectedEnquiry?.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status: status as any });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    await supabase.from('enquiries').delete().eq('id', id);
    setSelectedEnquiry(null);
    fetchEnquiries();
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'City', 'State', 'Category', 'Product', 'Message', 'Status', 'Date'];
    const rows = filteredEnquiries.map(e => [
      e.full_name,
      e.phone,
      e.email || '',
      e.city || '',
      e.state || '',
      e.product_category || '',
      e.product_name || '',
      (e.message || '').replace(/"/g, '""'),
      e.status,
      new Date(e.created_at).toLocaleString(),
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch = e.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.includes(searchQuery) ||
      (e.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedEnquiries = filteredEnquiries.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredEnquiries.length / pageSize);

  const newCount = enquiries.filter(e => e.status === 'new').length;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-dark-900">Enquiries</h1>
          <p className="text-dark-500 mt-1">
            {newCount > 0 && <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full mr-2">{newCount} new</span>}
            Manage customer enquiries
          </p>
        </div>
        <button onClick={exportToCSV} className="btn-secondary inline-flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-dark-200 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full md:w-40"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Phone</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-dark-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center"><span className="loader" /></td></tr>
              ) : paginatedEnquiries.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-dark-400">No enquiries found</td></tr>
              ) : (
                paginatedEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-dark-50 cursor-pointer" onClick={() => setSelectedEnquiry(enquiry)}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-dark-900">{enquiry.full_name}</p>
                      {enquiry.email && <p className="text-dark-500 text-sm">{enquiry.email}</p>}
                    </td>
                    <td className="px-6 py-4 text-dark-600">{enquiry.phone}</td>
                    <td className="px-6 py-4 text-dark-600">{enquiry.product_category || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        enquiry.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {enquiry.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-500 text-sm">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-dark-500 hover:text-accent-500">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-dark-200 flex items-center justify-between">
            <p className="text-sm text-dark-500">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredEnquiries.length)} of {filteredEnquiries.length}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-dark-100 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-dark-600">{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-dark-100 disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/50" onClick={() => setSelectedEnquiry(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-dark-200 flex justify-between items-center">
              <h2 className="font-heading font-semibold text-xl">Enquiry Details</h2>
              <button onClick={() => setSelectedEnquiry(null)} className="p-2 hover:bg-dark-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-dark-500 text-sm">Name</p>
                  <p className="font-medium text-dark-900">{selectedEnquiry.full_name}</p>
                </div>
                <div>
                  <p className="text-dark-500 text-sm">Phone</p>
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-medium text-accent-500">{selectedEnquiry.phone}</a>
                </div>
                <div>
                  <p className="text-dark-500 text-sm">Email</p>
                  <p className="font-medium text-dark-900">{selectedEnquiry.email || '-'}</p>
                </div>
                <div>
                  <p className="text-dark-500 text-sm">Location</p>
                  <p className="font-medium text-dark-900">{[selectedEnquiry.city, selectedEnquiry.state].filter(Boolean).join(', ') || '-'}</p>
                </div>
                <div>
                  <p className="text-dark-500 text-sm">Product Category</p>
                  <p className="font-medium text-dark-900">{selectedEnquiry.product_category || '-'}</p>
                </div>
                <div>
                  <p className="text-dark-500 text-sm">Product Name</p>
                  <p className="font-medium text-dark-900">{selectedEnquiry.product_name || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-dark-500 text-sm mb-2">Message</p>
                <p className="text-dark-700 bg-dark-50 p-3 rounded-lg">{selectedEnquiry.message || 'No message'}</p>
              </div>
              <div>
                <p className="text-dark-500 text-sm mb-2">Status</p>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => updateStatus(selectedEnquiry.id, e.target.value)}
                  className="input-field"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => handleDelete(selectedEnquiry.id)} className="btn-secondary flex-1 text-red-600 border-red-200 hover:bg-red-50">Delete</button>
                <a href={`https://wa.me/${selectedEnquiry.phone}?text=${encodeURIComponent('Hi, regarding your enquiry...')}`} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 text-center">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
