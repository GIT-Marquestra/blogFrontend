import React, { useState, useEffect } from 'react';
import { PlusIcon, XIcon, TrashIcon, HeartIcon, MessageCircleIcon, SendIcon } from 'lucide-react';
import { useAuth } from './SignStateContext';
import { backend } from '../backendString';
import toast from "react-hot-toast"

// Blog interface
interface Blog {
  id: string;
  title: string;
  desc: string;
  username: string;
  createdAt: string;
  user?: {
    username: string;
  };
  _count?: {
    likes: number;
    comments: number;
  };
  likes?: Like[];
  comments?: Comment[];
}

// Like interface
interface Like {
  id: string;
  blogId: string;
  username: string;
}

// Comment interface
interface Comment {
  id: string;
  content: string;
  username: string;
  blogId: string;
  createdAt: string;
}

export default function HomePage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedBlog, setExpandedBlog] = useState<Blog | null>(null);
  const { isSignedIn, username } = useAuth();
  const [loading, setLoading] = useState(false)
  const [newBlog, setNewBlog] = useState({
    title: '',
    desc: ''
  });
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  // Fetch blogs effect
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch(`${backend}/api/blogs`);
        const data = await response.json();
        setBlogs(data);
        if(data.length === 0){
          toast.error("No blogs")
          return 
        }
        console.log(data)
        toast.success("Blogs fetched")
      } catch (error) {
        console.error('Failed to fetch blogs', error);
      }
    }
    fetchBlogs();
  }, []);

  // Check if user has liked the blog
  useEffect(() => {
    if (expandedBlog && username) {
      const hasLiked = expandedBlog.likes?.some(like => like.username === username);
      setIsLiked(!!hasLiked);
    }
  }, [expandedBlog, username]);

  // Create blog handler
  const handleCreateBlog = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault();
    try {
      const response = await fetch(`${backend}/api/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newBlog,
          username
        })
      });

      if (response.ok) {
        const createdBlog = await response.json();
        setBlogs([createdBlog, ...blogs]);
        toast.success("Blog created successfully");
        closeModal();
      }
    } catch (error) {
      console.error('Failed to create blog', error);
      toast.error("Failed to create blog");
    } finally{
      setLoading(false)
    }
  };

  // Delete blog handler
  const handleDeleteBlog = async (blogId: string) => {
    try {
      toast.loading("Deleting...")
      const response = await fetch(`${backend}/api/blogs/${blogId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setBlogs(blogs.filter(blog => blog.id !== blogId));
        toast.success("Blog deleted successfully");
        setExpandedBlog(null);
      }
    } catch (error) {
      console.error('Failed to delete blog', error);
      toast.error("Failed to delete blog");
    } finally{
      toast.dismiss()
    }
  };

  // Handle like function
  const handleLike = (blogId: string) => async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to like blogs");
      return;
    }

    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`${backend}/api/blogs/${blogId}/likes`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });

      if (response.ok) {
        // Update local state
        if (expandedBlog && expandedBlog.id === blogId) {
          // Fetch updated blog to get latest likes
          const updatedBlogResponse = await fetch(`${backend}/api/blogs/${blogId}`);
          const updatedBlog = await updatedBlogResponse.json();
          setExpandedBlog(updatedBlog);
        }

        // Update blogs list with proper type handling
        setBlogs(prevBlogs => 
          prevBlogs.map(blog => {
            if (blog.id === blogId) {
              const likeCount = blog._count?.likes || 0;
              return {
                ...blog,
                _count: {
                  ...blog._count,
                  likes: isLiked ? likeCount - 1 : likeCount + 1
                }
              } as Blog;  // Explicitly cast back to Blog type
            }
            return blog;
          })
        );
        
        setIsLiked(!isLiked);
        toast.success(isLiked ? "Unliked" : "Liked");
      }
    } catch (error) {
      console.error('Failed to like/unlike blog', error);
      toast.error("Failed to process like");
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expandedBlog || !newComment.trim()) {
      return;
    }

    try {
      const response = await fetch(`${backend}/api/blogs/${expandedBlog.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: newComment,
          username
        })
      });

      if (response.ok) {
        const comment = await response.json();
        
        // Update expanded blog with new comment
        setExpandedBlog(prev => {
          if (!prev) return null;
          
          const updatedComments = [...(prev.comments || []), comment];
          const updatedCommentCount = prev._count ? {
            ...prev._count,
            comments: (prev._count.comments || 0) + 1
          } : { comments: 1, likes: 0 };
          
          return {
            ...prev,
            comments: updatedComments,
            _count: updatedCommentCount
          };
        });

        // Update blogs list comment count with proper type handling
        setBlogs(prevBlogs => 
          prevBlogs.map(blog => {
            if (blog.id === expandedBlog.id) {
              const commentCount = blog._count?.comments || 0;
              return {
                ...blog,
                _count: {
                  ...blog._count,
                  comments: commentCount + 1
                }
              } as Blog;  // Explicitly cast back to Blog type
            }
            return blog;
          })
        );

        setNewComment('');
        toast.success("Comment added");
      }
    } catch (error) {
      console.error('Failed to add comment', error);
      toast.error("Failed to add comment");
    }
  };

  // Open expanded blog view
  const openBlogExpand = async (blog: Blog) => {
    try {
      toast.loading("Opening")
      // Fetch full blog details including likes and comments
      const response = await fetch(`${backend}/api/blogs/${blog.id}`);
      const fullBlog = await response.json();
      setExpandedBlog(fullBlog);
    } catch (error) {
      console.error('Failed to fetch blog details', error);
      setExpandedBlog(blog); // Fallback to basic blog info
    } finally{
      toast.dismiss()
    }
  };

  // Modal open and close functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewBlog({ title: '', desc: '' });
  };
  const closeExpandedBlog = () => setExpandedBlog(null);

  if(!isSignedIn){
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg text-center border border-purple-900">
                <h2 className="text-2xl font-bold mb-4 text-purple-400">Sign In Required</h2>
                <p className="text-gray-300 mb-6">Please sign in to view and interact with blogs.</p>
                <button onClick={() => {
                  window.location.href = '/signin'
                }} className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-6 rounded-md transition-colors duration-300">
                    Sign In
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Blogs</h1>
        
        {/* Blog List */}
        <div className="space-y-6">
          {blogs.length === 0 ? (
            <div className="bg-gray-900 border border-purple-900 rounded-lg p-8 text-center">
              <p className="text-gray-300">No blogs found. Create your first blog post!</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div 
                key={blog.id} 
                className="bg-gray-900 border border-purple-900 rounded-lg p-5 shadow-md cursor-pointer transition-all hover:bg-gray-800"
                onClick={() => openBlogExpand(blog)}
              >
                <h2 className="text-xl font-semibold text-purple-300 mb-3">
                  {blog.title}
                </h2>
                <p className="text-gray-300 mb-4">
                  {blog.desc.length > 100 ? `${blog.desc.slice(0, 100)}...` : blog.desc}
                </p>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>
                    By {blog.username || 'Anonymous'} on {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-4">
                    <span className="flex items-center">
                      <HeartIcon className={`w-4 h-4 mr-1 ${blog.likes?.some(like => like.username === username) ? 'text-pink-500 fill-pink-500' : 'text-gray-400'}`} />
                      {blog._count?.likes || 0}
                    </span>
                    <span className="flex items-center">
                      <MessageCircleIcon className="w-4 h-4 mr-1" />
                      {blog._count?.comments || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Expanded Blog Modal with Comments */}
        {expandedBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col relative border border-purple-900">
              {/* Close Button */}
              <button 
                onClick={closeExpandedBlog}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <XIcon className="w-6 h-6" />
              </button>

              {/* Delete Button (only for blog owner) */}
              {expandedBlog.username === username && (
                <button 
                  onClick={() => handleDeleteBlog(expandedBlog.id)}
                  className="absolute top-4 right-14 text-pink-500 hover:text-pink-700"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              )}

              <div className="overflow-y-auto p-6 flex-grow">
                {/* Blog Details */}
                <h2 className="text-2xl font-bold mb-4 text-purple-300">
                  {expandedBlog.title}
                </h2>
                <p className="text-gray-300 mb-6 whitespace-pre-wrap leading-relaxed">
                  {expandedBlog.desc}
                </p>
                <div className="text-gray-500 text-sm mb-6 flex justify-between items-center">
                  <span>
                    By {expandedBlog.username || 'Anonymous'} on {new Date(expandedBlog.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handleLike(expandedBlog.id)}
                      className={`flex items-center ${isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'}`}
                    >
                      <HeartIcon className={`w-5 h-5 mr-1 ${isLiked ? 'fill-pink-500' : ''}`} />
                    </button>
                    <div className="flex items-center text-gray-400">
                      <MessageCircleIcon className="w-5 h-5 mr-1" />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-purple-900 my-6"></div>

                {/* Comments Section */}
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-4 text-purple-300">Comments</h3>
                  
                  {/* Comment List */}
                  <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                    {expandedBlog.comments && expandedBlog.comments.length > 0 ? (
                      expandedBlog.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-800 rounded-lg p-3 border border-purple-900">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-gray-300">{comment.content}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-purple-300 text-sm">{comment.username}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="border-t border-purple-900 p-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-grow bg-gray-800 text-white border border-purple-800 
                            rounded-md px-3 py-2 focus:outline-none focus:ring-2 
                            focus:ring-purple-500 placeholder-gray-400"
                  required
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-900 disabled:opacity-50
                            text-white rounded-md px-3 flex items-center justify-center
                            transition-colors duration-300"
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Create Blog Button */}
        <button 
          onClick={openModal}
          className="fixed bottom-6 right-6 bg-purple-700 hover:bg-purple-800 text-white 
                     rounded-full w-12 h-12 flex items-center justify-center 
                     shadow-lg transition-colors duration-300"
        >
          <PlusIcon className="w-6 h-6" />
        </button>

        {/* Create Blog Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg w-96 p-6 relative border border-purple-900">
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <XIcon className="w-6 h-6" />
              </button>

              {/* Modal Title */}
              <h2 className="text-2xl font-bold mb-6 text-white">
                Create New Blog
              </h2>

              {/* Blog Form */}
              <form onSubmit={handleCreateBlog} className="space-y-4">
                <input 
                  type="text"
                  placeholder="Blog Title"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                  className="w-full bg-black text-white border border-purple-800 
                             rounded-md px-3 py-2 focus:outline-none focus:ring-2 
                             focus:ring-purple-500 placeholder-gray-500"
                  required
                />
                <textarea 
                  placeholder="Blog Description"
                  value={newBlog.desc}
                  onChange={(e) => setNewBlog({...newBlog, desc: e.target.value})}
                  className="w-full bg-black text-white border border-purple-800 
                             rounded-md px-3 py-2 min-h-[150px] focus:outline-none 
                             focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                  required
                />
                <button 
                  type="submit"
                  className="w-full bg-purple-400 hover:bg-purple-600 text-white 
                             rounded-md py-2 transition-colors duration-300"
                >
                  {loading ? "Creating...": "Create Blog"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}