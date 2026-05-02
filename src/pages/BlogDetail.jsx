import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogStore } from '../store/useBlogStore';

export default function BlogDetail() {
  const { id } = useParams();
  const { currentBlog, fetchBlogById, isLoading } = useBlogStore();

  useEffect(() => {
    if (id) {
      fetchBlogById(id);
    }
  }, [id, fetchBlogById]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground py-20 px-4 flex justify-center">
        <div className="animate-pulse flex flex-col gap-4 w-full max-w-4xl">
          <div className="h-10 bg-muted rounded w-3/4"></div>
          <div className="h-6 bg-muted rounded w-1/4"></div>
          <div className="h-96 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen bg-background text-foreground py-20 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Blog Not Found</h2>
        <p className="text-muted-foreground mb-8">The article you are looking for does not exist.</p>
        <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Header */}
      <header className="bg-primary/5 border-b border-primary/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {currentBlog.category && (
            <span className="inline-block bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full font-medium shadow-sm mb-6">
              {currentBlog.category.name}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            {currentBlog.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {(currentBlog.author?.email || "U")[0].toUpperCase()}
              </div>
              <span className="font-medium text-foreground">{currentBlog.author?.email || "Unknown Author"}</span>
            </div>
            <span>•</span>
            <time dateTime={currentBlog.createdAt}>
              {new Date(currentBlog.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentBlog.imageUrl && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg border">
            <img 
              src={currentBlog.imageUrl} 
              alt={currentBlog.title} 
              className="w-full h-auto max-h-[600px] object-cover"
            />
          </div>
        )}
        
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
          {currentBlog.content.split('\n').map((paragraph, index) => (
            paragraph.trim() ? <p key={index} className="mb-6 leading-relaxed text-lg">{paragraph}</p> : <br key={index} />
          ))}
        </div>
      </div>
    </article>
  );
}
