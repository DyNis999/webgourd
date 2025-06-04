import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Socialmedia.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { getUser } from '../../utils/helpers';
import Topcontributor from '../Layout/Topcontributor';
import { filterBadWords } from '../Layout/filteredwords';
import { FaEdit, FaTrash } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';

const TEXT_LIMIT = 250;
const Socialmedia = () => {
    const [posts, setPosts] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [replyContent, setReplyContent] = useState('');
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [expandedComments, setExpandedComments] = useState({});
    const [expandedReplies, setExpandedReplies] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const currentUser = getUser();
    const [expandedPosts, setExpandedPosts] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImages, setModalImages] = useState([]); // store all images
    const [modalImageIndex, setModalImageIndex] = useState(0); // store current index

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/posts`);
                const approvedPosts = response.data.filter(post => post.status === 'Approved');
                setPosts(approvedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);


    const toggleExpandPost = (postId) => {
        setExpandedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const renderContent = (post) => {
        const content = post.content || "";
        if (content.length <= TEXT_LIMIT) return <span>{content}</span>;
        if (expandedPosts[post._id]) {
            return (
                <>
                    {content}
                    <span className="see-more" onClick={() => toggleExpandPost(post._id)}> See less</span>
                </>
            );
        }
        return (
            <>
                {content.slice(0, TEXT_LIMIT)}...
                <span className="see-more" onClick={() => toggleExpandPost(post._id)}> See more</span>
            </>
        );
    };

    const openImageModal = (images, index) => {
        setModalImages(images);
        setModalImageIndex(index);
        setModalOpen(true);
    };

    const closeImageModal = () => {
        setModalOpen(false);
        setModalImages([]);
        setModalImageIndex(0);
    };

    const showPrevImage = (e) => {
        e.stopPropagation();
        setModalImageIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1));
    };

    const showNextImage = (e) => {
        e.stopPropagation();
        setModalImageIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1));
    };

    const handleAddComment = async (postId) => {
        if (!currentUser) {
            alert('If you have not account yet create and login first');
            return;
        }
        const filteredComment = filterBadWords(commentContent);
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/posts/${postId}/comments`, {
                content: filteredComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(posts.map(post => post._id === postId ? response.data : post));
            setCommentContent('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleAddReply = async (postId, commentId) => {
        if (!currentUser) {
            alert('If you have not account yet create and login first');
            return;
        }
        const filteredReply = filterBadWords(replyContent);
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/posts/${postId}/comments/${commentId}/replies`, {
                content: filteredReply
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(posts.map(post => post._id === postId ? response.data : post));
            setReplyContent('');
            setSelectedCommentId(null);
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const handleLikePost = async (postId) => {
        if (!currentUser) {
            alert('If you have not account yet create and login first');
            return;
        }
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(posts.map(post => post._id === postId ? { ...post, likes: response.data.likes, likedBy: response.data.likedBy } : post));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleReplyClick = (commentId) => {
        if (!currentUser) {
            alert('If you have not account yet create and login first');
            return;
        }
        setSelectedCommentId(selectedCommentId === commentId ? null : commentId);
    };

    const toggleExpandComments = (postId) => {
        setExpandedComments(prevState => ({
            ...prevState,
            [postId]: !prevState[postId]
        }));
    };

    const toggleExpandReplies = (commentId) => {
        setExpandedReplies(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredPosts = posts.filter(post =>
        post?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        post?.content?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        post?.user?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
    );

    const handleEditComment = async (postId, commentId, newContent) => {
        const filteredEdit = filterBadWords(newContent);
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.put(`${process.env.REACT_APP_API}/api/v1/posts/${postId}/comments/${commentId}`, {
                content: filteredEdit
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(posts.map(post => post._id === postId ? response.data : post));
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/posts/${postId}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(posts.map(post => ({
                ...post,
                comments: post.comments.filter(comment => comment._id !== commentId)
            })));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleEditReply = async (postId, commentId, replyId, newContent) => {
        const filteredEdit = filterBadWords(newContent);
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.put(`${process.env.REACT_APP_API}/api/v1/posts/${postId}/comments/${commentId}/replies/${replyId}`, {
                content: filteredEdit
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(posts.map(post => post._id === postId ? response.data : post));
        } catch (error) {
            console.error('Error editing reply:', error);
        }
    };

    const handleDeleteReply = async (postId, commentId, replyId) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/posts/${postId}/comments/${commentId}/replies/${replyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(posts.map(post => ({
                ...post,
                comments: post.comments.map(comment =>
                    comment._id === commentId ? {
                        ...comment,
                        replies: comment.replies.filter(reply => reply._id !== replyId)
                    } : comment
                )
            })));
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    const mostLikedPostRef = useRef(null);

    // Find the most liked post
    const mostLikedPost = filteredPosts.reduce((max, post) => (post.likes > (max?.likes || 0) ? post : max), null);
    // Scroll handler
    const handleHighlightClick = () => {
        if (mostLikedPostRef.current) {
            mostLikedPostRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };



    return (
        <div className="social-media-feed">
            <div style={{ flex: 1, paddingLeft: '20px', paddingTop: '20px' }}>
                <div className="search-bar">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        <i className="search-icon fas fa-search"></i>
                    </div>
                </div>


                <div
                >
                    <Topcontributor />
                </div>
            </div>

            {/* <div className="main-content">
                {[...filteredPosts].reverse().map(post => (
                    <div key={post._id} className="post"
                        ref={mostLikedPost && post._id === mostLikedPost._id ? mostLikedPostRef : null}>
                        <div className="post-header">
                            {post.user && post.user.image ? (
                                <img src={post.user.image} alt={post.user.name} className="user-image" />
                            ) : (
                                <div className="user-image-placeholder" />
                            )}
                            <div className="user-info">
                                <h3>{post.user ? post.user.name : "Unknown User"}</h3>
                                <p>{post.user ? post.user.email : ""}</p>
                            </div>
                        </div>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <div className="post-images">
                            {post.images.length > 1 ? (
                                <Carousel showThumbs={false} className="post-carousel">
                                    {post.images.map(image => (
                                        <div key={image} className="carousel-image-container">
                                            <img src={image} alt={post.title} className="post-image" />
                                        </div>
                                    ))}
                                </Carousel>
                            ) : (
                                post.images.map(image => (
                                    <div key={image} className="single-image-container">
                                        <img src={image} alt={post.title} className="post-image" />
                                    </div>
                                ))
                            )}
                        </div> */}
            <div className="main-content">
                {[...filteredPosts].reverse().map(post => (
                    <div key={post._id} className="post"
                        ref={mostLikedPost && post._id === mostLikedPost._id ? mostLikedPostRef : null}>
                        <div className="post-header">
                            {post.user && post.user.image ? (
                                <img src={post.user.image} alt={post.user.name} className="user-image" />
                            ) : (
                                <div className="user-image-placeholder" />
                            )}
                            <div className="user-info">
                                <h3>{post.user ? post.user.name : "Unknown User"}</h3>
                                <p>{post.user ? post.user.email : ""}</p>
                            </div>
                        </div>
                        <h2 className="post-title">{post.title}</h2>
                        <p className="post-content">{renderContent(post)}</p>
                        {/* <div className="post-images">
                            {post.images.length > 1 ? (
                                <Carousel showThumbs={false} className="post-carousel">
                                    {post.images.map(image => (
                                        <div key={image} className="carousel-image-container">
                                            <img src={image} alt={post.title} className="post-image uniform-image" />
                                        </div>
                                    ))}
                                </Carousel>
                            ) : (
                                post.images.map(image => (
                                    <div key={image} className="single-image-container">
                                        <img src={image} alt={post.title} className="post-image uniform-image" />
                                    </div>
                                ))
                            )}
                        </div> */}


                        <div className="post-images">
                            {post.images.length > 1 ? (
                                <Carousel
                                    showThumbs={false}
                                    className="post-carousel"
                                    onClickItem={idx => openImageModal(post.images, idx)}
                                >
                                    {post.images.map((image, idx) => (
                                        <div key={image} className="carousel-image-container">
                                            <img
                                                src={image}
                                                alt={post.title}
                                                className="post-image uniform-image"
                                                style={{ cursor: "pointer" }}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                            ) : (
                                post.images.map((image, idx) => (
                                    <div key={image} className="single-image-container">
                                        <img
                                            src={image}
                                            alt={post.title}
                                            className="post-image uniform-image"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => openImageModal(post.images, idx)}
                                        />
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="post-actions">
                            <button
                                onClick={() => handleLikePost(post._id)}
                                className={post.likedBy.includes(currentUser?._id) ? 'liked' : 'not-liked'}
                            >
                                <FontAwesomeIcon icon={faThumbsUp} className="like-icon" />
                                ({post.likes})
                            </button>
                            <button onClick={() => toggleExpandComments(post._id)}>
                                <FontAwesomeIcon icon={faComment} className='comment-icon' />
                                ({post.comments.length})
                            </button>
                        </div>
                        {expandedComments[post._id] && (
                            <div className="post-comments">
                                {/* {post.comments.map(comment => (
                                    <div key={comment._id} className="comment">
                                        <img src={comment.user.image} alt={comment.user.name} className="comment-user-image" />
                                        <div className="comment-content">
                                            <h5>{comment.user.name}</h5>
                                            <p>{comment.content}</p>
                                            {comment.user._id === currentUser?._id && (
                                                <div className="comment-actions">
                                                    <FaEdit className="icon edit-icon" onClick={() => {
                                                        const newContent = prompt("Edit your comment", comment.content);
                                                        if (newContent !== null) handleEditComment(post._id, comment._id, newContent);
                                                    }} />
                                                    <FaTrash className="icon delete-icon" onClick={() => handleDeleteComment(post._id, comment._id)} />
                                                </div> */}
                                {post.comments.map(comment => (
                                    <div key={comment._id} className="comment">
                                        {comment.user && comment.user.image ? (
                                            <img src={comment.user.image} alt={comment.user.name || "User"} className="comment-user-image" />
                                        ) : (
                                            <div className="comment-user-image comment-user-image-placeholder" />
                                        )}
                                        <div className="comment-content">
                                            <h5>{comment.user ? comment.user.name : "Unknown User"}</h5>
                                            <p>{comment.content}</p>
                                            {comment.user && comment.user._id === currentUser?._id && (
                                                <div className="comment-actions">
                                                    <FaEdit className="icon edit-icon" onClick={() => {
                                                        const newContent = prompt("Edit your comment", comment.content);
                                                        if (newContent !== null) handleEditComment(post._id, comment._id, newContent);
                                                    }} />
                                                    <FaTrash className="icon delete-icon" onClick={() => handleDeleteComment(post._id, comment._id)} />
                                                </div>




                                            )}

                                            {/* <div className="comment-replies">
                                                {comment.replies.slice(0, expandedReplies[comment._id] ? comment.replies.length : 1).map(reply => (
                                                    <div key={reply._id} className="reply">
                                                        <img src={reply.user.image} alt={reply.user.name} className="reply-user-image" />
                                                        <div className="reply-content">
                                                            <h6>{reply.user.name}</h6>
                                                            <p>{reply.content}</p>
                                                            {reply.user._id === currentUser?._id && (
                                                                <div className="comment-actions">
                                                                    <FaEdit className="icon edit-icon" onClick={() => {
                                                                        const newContent = prompt("Edit your reply", reply.content);
                                                                        if (newContent !== null) handleEditReply(post._id, comment._id, reply._id, newContent);
                                                                    }} />
                                                                    <FaTrash className="icon delete-icon" onClick={() => handleDeleteReply(post._id, comment._id, reply._id)} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                {comment.replies.length > 1 && (
                                                    <p className="see-more" onClick={() => toggleExpandReplies(comment._id)}>
                                                        {expandedReplies[comment._id] ? 'See less' : 'See more'}
                                                    </p>
                                                )}
                                            </div> */}


                                            <div className="comment-replies">
                                                {comment.replies.slice(0, expandedReplies[comment._id] ? comment.replies.length : 1).map(reply => (
                                                    <div key={reply._id} className="reply">
                                                        {reply.user && reply.user.image ? (
                                                            <img src={reply.user.image} alt={reply.user.name || "User"} className="reply-user-image" />
                                                        ) : (
                                                            <div className="reply-user-image reply-user-image-placeholder" />
                                                        )}
                                                        <div className="reply-content">
                                                            <h6>{reply.user ? reply.user.name : "Unknown User"}</h6>
                                                            <p>{reply.content}</p>
                                                            {reply.user && reply.user._id === currentUser?._id && (
                                                                <div className="comment-actions">
                                                                    <FaEdit className="icon edit-icon" onClick={() => {
                                                                        const newContent = prompt("Edit your reply", reply.content);
                                                                        if (newContent !== null) handleEditReply(post._id, comment._id, reply._id, newContent);
                                                                    }} />
                                                                    <FaTrash className="icon delete-icon" onClick={() => handleDeleteReply(post._id, comment._id, reply._id)} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                {comment.replies.length > 1 && (
                                                    <p className="see-more" onClick={() => toggleExpandReplies(comment._id)}>
                                                        {expandedReplies[comment._id] ? 'See less' : 'See more'}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="reply-text" onClick={() => handleReplyClick(comment._id)}>Reply</p>
                                            {selectedCommentId === comment._id && (
                                                <div className="reply-form">
                                                    <input
                                                        type="text"
                                                        placeholder="Add a reply..."
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                    />
                                                    <button onClick={() => handleAddReply(post._id, comment._id)}>Reply</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div className="comment-form">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                    />
                                    <button onClick={() => handleAddComment(post._id)}>Comment</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ padding: '20px' }}>
                {/* Highlight Most Liked Post as a Card */}
                {mostLikedPost && (
                    <div className="highlight-card"
                        style={{ cursor: 'pointer' }}
                        onClick={handleHighlightClick}
                        title="Go to this post"
                    >
                        <div className="highlight-header">
                            <span className="highlight-label">Highlight Post</span>
                            <span className="highlight-quote">"Inspire everyone with your gourds"</span>
                        </div>
                        <div className="highlight-content">
                            <div className="post-header">
                                {mostLikedPost.user && mostLikedPost.user.image ? (
                                    <img src={mostLikedPost.user.image} alt={mostLikedPost.user.name} className="user-image" />
                                ) : (
                                    <div className="user-image-placeholder" />
                                )}
                                <div className="user-info">
                                    <h3>{mostLikedPost.user ? mostLikedPost.user.name : "Unknown User"}</h3>
                                    <p>{mostLikedPost.user ? mostLikedPost.user.email : ""}</p>
                                </div>
                            </div>
                            <h2>{mostLikedPost.title}</h2>
                            <p>{mostLikedPost.content}</p>
                            <div className="post-images">
                                {mostLikedPost.images.length > 1 ? (
                                    <Carousel showThumbs={false} className="post-carousel">
                                        {mostLikedPost.images.map(image => (
                                            <div key={image} className="carousel-image-container">
                                                <img src={image} alt={mostLikedPost.title} className="post-image" />
                                            </div>
                                        ))}
                                    </Carousel>
                                ) : (
                                    mostLikedPost.images.map(image => (
                                        <div key={image} className="single-image-container">
                                            <img src={image} alt={mostLikedPost.title} className="post-image" />
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="post-actions">
                                <button
                                    className={mostLikedPost.likedBy.includes(currentUser?._id) ? 'liked' : 'not-liked'}
                                    disabled
                                >
                                    <FontAwesomeIcon icon={faThumbsUp} className="like-icon" />
                                    ({mostLikedPost.likes})
                                </button>
                                <button disabled>
                                    <FontAwesomeIcon icon={faComment} className='comment-icon' />
                                    ({mostLikedPost.comments.length})
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>


            {modalOpen && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="image-modal-content" onClick={e => e.stopPropagation()}>
                        {modalImages.length > 1 && (
                            <button className="modal-nav-btn left" onClick={showPrevImage}>&lt;</button>
                        )}
                        <img
                            src={modalImages[modalImageIndex]}
                            alt="Full Size"
                            className="modal-full-image Modaluniform-image" // Add uniform-image here
                        />
                        {modalImages.length > 1 && (
                            <button className="modal-nav-btn right" onClick={showNextImage}>&gt;</button>
                        )}
                        <button className="close-modal-btn" onClick={closeImageModal}>×</button>
                        <div style={{ marginTop: 8, color: "#888", fontSize: "0.95em" }}>
                            {modalImageIndex + 1} / {modalImages.length}
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
};

export default Socialmedia;