import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Socialmedia.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { getUser } from '../../utils/helpers'; // Adjust the import path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const UserPost = () => {
    const [posts, setPosts] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [replyContent, setReplyContent] = useState('');
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [expandedComments, setExpandedComments] = useState({});
    const [expandedReplies, setExpandedReplies] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchedUser = getUser();
        if (fetchedUser) {
            setCurrentUser(fetchedUser);
            console.log('Fetched user:', fetchedUser);
        } else {
            console.error('No current user found');
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!currentUser || !currentUser.id) {
                console.error('No current user found');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:4000/api/v1/posts/user/${currentUser.id}`);
                console.log('Fetched user posts:', response.data);
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        if (currentUser) {
            fetchPosts();
        }
    }, [currentUser]);

    const handleAddComment = async (postId) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(`http://localhost:4000/api/v1/posts/${postId}/comments`, {
                content: commentContent
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
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(`http://localhost:4000/api/v1/posts/${postId}/comments/${commentId}/replies`, {
                content: replyContent
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(posts.map(post => post._id === postId ? response.data : post));
            setReplyContent('');
            setSelectedCommentId(null); // Hide the reply input box after submitting
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const handleLikePost = async (postId) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(`http://localhost:4000/api/v1/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(posts.map(post => post._id === postId ? { ...post, likes: response.data.likes, likedBy: response.data.likedBy } : post));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleReplyClick = (commentId) => {
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

    const handleDeletePost = async (postId) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`http://localhost:4000/api/v1/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(posts.filter(post => post._id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleUpdatePost = (postId) => {
        navigate(`/updatePost/${postId}`);
    };

    return (
        <div className="social-media-feed">
            {posts.map(post => (
                <div key={post._id} className="post">
                    <div className="post-header">
                        <img src={post.user.image} alt={post.user.name} className="user-image" />
                        <div className="user-info">
                            <h3>{post.user.name}</h3>
                            <p>{post.user.email}</p>
                        </div>
                        {post.user._id === currentUser.id && (
                            <div className="post-menu">
                                <FontAwesomeIcon icon={faEdit} onClick={() => handleUpdatePost(post._id)} />
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleDeletePost(post._id)} />
                            </div>
                        )}
                    </div>
                    <div className="post-content">
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <div className="post-images">
                            {post.images.length > 1 ? (
                                <Carousel showThumbs={false}>
                                    {post.images.map(image => (
                                        <div key={image}>
                                            <img src={image} alt={post.title} className="post-image" />
                                        </div>
                                    ))}
                                </Carousel>
                            ) : (
                                post.images.map(image => (
                                    <img key={image} src={image} alt={post.title} className="post-image" />
                                ))
                            )}
                        </div>
                    </div>
                    <div className="post-actions">
                        <button onClick={() => handleLikePost(post._id)}>
                            {post.likedBy.includes(currentUser.id) ? 'Unlike' : 'Like'} ({post.likes})
                        </button>
                        <button onClick={() => toggleExpandComments(post._id)}>
                            {expandedComments[post._id] ? 'Hide Comments' : 'Show Comments'}
                        </button>
                    </div>
                    {expandedComments[post._id] && (
                        <div className="post-comments">
                            {post.comments.map(comment => (
                                <div key={comment._id} className="comment">
                                    <img src={comment.user.image} alt={comment.user.name} className="comment-user-image" />
                                    <div className="comment-content">
                                        <h5>{comment.user.name}</h5>
                                        <p>{comment.content}</p>
                                        <div className="comment-replies">
                                            {comment.replies.slice(0, expandedReplies[comment._id] ? comment.replies.length : 1).map(reply => (
                                                <div key={reply._id} className="reply">
                                                    <img src={reply.user.image} alt={reply.user.name} className="reply-user-image" />
                                                    <div className="reply-content">
                                                        <h6>{reply.user.name}</h6>
                                                        <p>{reply.content}</p>
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
    );
};

export default UserPost;