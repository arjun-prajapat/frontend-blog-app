import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <Link to={`/blog/${blog.id}`} className="group rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 block">
      <div className="h-48 overflow-hidden bg-muted relative">
        <img
          src={
            blog.imageUrl ||
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80"
          }
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {blog.category && (
          <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
            {blog.category.name}
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{blog.author?.email || "Unknown Author"}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {blog.content}
        </p>
      </div>
    </Link>
  );
}
