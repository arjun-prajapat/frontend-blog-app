import React, { useEffect, useState } from "react";
import { useBlogStore } from "../store/useBlogStore";
import { useCategoryStore } from "../store/useCategoryStore";
import BlogCard from "../components/BlogCard";

export default function Home() {
  const { blogs, fetchBlogs, isLoading } = useBlogStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchBlogs(search, selectedCategory);
  }, [fetchBlogs, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Explore the <span className="text-primary">BlogVerse</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Discover insights, stories, and expertise from writers around the
            globe. Join our community of avid readers.
          </p>

          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 h-12 rounded-full border border-input bg-card px-6 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 rounded-full border border-input bg-card px-6 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm appearance-none sm:w-48"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.slug || cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Latest Articles</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl border bg-card p-4 shadow-sm animate-pulse"
              >
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs?.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed rounded-xl bg-muted/30">
            <h3 className="text-xl font-medium text-foreground mb-2">
              No blogs found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or category filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
