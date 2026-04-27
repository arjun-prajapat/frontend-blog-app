import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCategoryStore } from '../store/useCategoryStore';
import { useBlogStore } from '../store/useBlogStore';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { categories, fetchCategories, createCategory, deleteCategory } = useCategoryStore();
  const { blogs, fetchBlogs, createBlog, deleteBlog } = useBlogStore();
  
  const [activeTab, setActiveTab] = useState('blogs'); // 'blogs' or 'categories'
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', categoryId: '', name: '', description: '' });

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, [fetchCategories, fetchBlogs]);

  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'blogs') {
        await createBlog({
          title: formData.title,
          content: formData.content,
          categoryId: formData.categoryId,
          slug: generateSlug(formData.title),
        });
      } else {
        await createCategory({
          name: formData.name,
          description: formData.description,
          slug: generateSlug(formData.name),
        });
      }
      setShowModal(false);
      setFormData({ title: '', content: '', categoryId: '', name: '', description: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error occurred');
    }
  };

  const myBlogs = blogs.filter(b => b.author?.id === user?.id || !b.author);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your content here.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium inline-flex items-center gap-2 hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" />
          Create {activeTab === 'blogs' ? 'Blog' : 'Category'}
        </button>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium border-b-2 transition-colors ${activeTab === 'blogs' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('blogs')}
        >
          My Blogs
        </button>
        {user?.role === 'ADMIN' && (
          <button
            className={`py-2 px-4 font-medium border-b-2 transition-colors ${activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
        )}
      </div>

      {activeTab === 'blogs' && (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myBlogs.map(blog => (
                <tr key={blog.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{blog.title}</td>
                  <td className="px-6 py-4">{blog.category?.name}</td>
                  <td className="px-6 py-4">{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteBlog(blog.id)} className="text-destructive hover:text-destructive/80 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {myBlogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">No blogs found. Create one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div key={cat.id} className="bg-card border rounded-xl p-6 flex justify-between items-start shadow-sm">
              <div>
                <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                <p className="text-sm text-muted-foreground">{cat.description || 'No description'}</p>
              </div>
              <button onClick={() => deleteCategory(cat.id)} className="text-destructive hover:text-destructive/80 p-1">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-xl shadow-lg w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Create {activeTab === 'blogs' ? 'Blog' : 'Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'blogs' ? (
                <>
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Content</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    ></textarea>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium">Category Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    ></textarea>
                  </div>
                </>
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-md font-medium bg-secondary text-secondary-foreground">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md font-medium bg-primary text-primary-foreground">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
