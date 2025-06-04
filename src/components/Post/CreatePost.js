// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Select from 'react-select';
// import './CreatePost.css'; // Assuming you have a CSS file for styles

// const CreatePost = () => {
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [error, setError] = useState("");
//     const [images, setImages] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const token = sessionStorage.getItem('token');
//                 if (!token) {
//                     setError("No token found in sessionStorage");
//                     return;
//                 }

//                 const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/categories/getall`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 const formattedCategories = response.data.map((category) => ({
//                     label: category.name,
//                     value: category._id,
//                 }));
//                 setCategories(formattedCategories);
//             } catch (error) {
//                 console.error('Error fetching categories:', error.message);
//             }
//         };

//         fetchCategories();
//     }, []);

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         setImages(files);
//     };

//     const createPost = async (e) => {
//         e.preventDefault();
//         if (!title || !content || !selectedCategory) {
//             setError("Please fill in all fields.");
//             return;
//         }
//         toast.success("Creating your post...");

//         let formData = new FormData();
//         formData.append("title", title);
//         formData.append("content", content);
//         formData.append("category", selectedCategory.value);

//         images.forEach((image) => {
//             formData.append("images", image);
//         });

//         try {
//             const token = sessionStorage.getItem('token');
//             if (!token) {
//                 throw new Error("No token found in sessionStorage");
//             }

//             // Send the request
//             const response = await fetch(`${process.env.REACT_APP_API}/api/v1/posts`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`, // Ensure this is correctly passed
//                 },
//                 body: formData,
//                 credentials: 'include',  // This ensures the cookie is sent
//             });

//             if (response.status === 201) {
//                 // Inform user to wait for admin approval
//                 toast.info("Your post is under review. Please wait until the admin approves it.");

//                 // Clear the input fields
//                 setTitle('');
//                 setContent('');
//                 setSelectedCategory(null);
//                 setImages([]); // Clear images
//                 setTimeout(() => {
//                     navigate("/home");
//                 }, 5000);
//             }
//         } catch (error) {
//             console.error('Error creating post:', error.message);
//             setError(error.response?.data?.message || 'Something went wrong');
//             toast.error(error.response?.data?.message || "Please try again");
//         }
//     };

//     return (
//         <div className="create-post-container">
//             <h1>Create Post</h1>
//             <form onSubmit={createPost}>
//                 <div className="form-group">
//                     <label>Title</label>
//                     <input
//                         type="text"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Content</label>
//                     <textarea
//                         value={content}
//                         onChange={(e) => setContent(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Category</label>
//                     <Select
//                         value={selectedCategory}
//                         onChange={setSelectedCategory}
//                         options={categories}
//                         placeholder="Select a Category"
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Images</label>
//                     <input type="file" multiple onChange={handleImageChange} />
//                     <div className="image-preview">
//                         {images.length > 0 ? (
//                             images.map((image, index) => (
//                                 <img
//                                     key={index}
//                                     src={URL.createObjectURL(image)}
//                                     alt={`Preview ${index + 1}`}
//                                     className="image-thumbnail"
//                                 />
//                             ))
//                         ) : (
//                             <p>Select Images</p>
//                         )}
//                     </div>
//                 </div>
//                 {error && <p className="error">{error}</p>}
//                 <button type="submit" className="btn btn-primary">Create Post</button>
//             </form>

//             {/* ToastContainer is placed here to display the toasts */}
//             <ToastContainer position="top-right" autoClose={6000} theme="colored" />
//         </div>
//     );
// };

// export default CreatePost;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import './CreatePost.css';

const IMAGE_WIDTH = 600;   // px
const IMAGE_HEIGHT = 400;  // px

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState("");
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [previewUrls, setPreviewUrls] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    setError("No token found in sessionStorage");
                    return;
                }
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/categories/getall`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const formattedCategories = response.data.map((category) => ({
                    label: category.name,
                    value: category._id,
                }));
                setCategories(formattedCategories);
            } catch (error) {
                console.error('Error fetching categories:', error.message);
            }
        };
        fetchCategories();
    }, []);

    // Resize image using canvas
    const resizeImage = (file, maxWidth, maxHeight) => {
        return new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = maxWidth;
                canvas.height = maxHeight;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, maxWidth, maxHeight);

                // Calculate aspect ratio fit
                let ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
                let newWidth = img.width * ratio;
                let newHeight = img.height * ratio;
                let x = (maxWidth - newWidth) / 2;
                let y = (maxHeight - newHeight) / 2;

                ctx.drawImage(img, x, y, newWidth, newHeight);
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, { type: file.type }));
                }, file.type, 0.92);
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const resizedImages = await Promise.all(
            files.map(file => resizeImage(file, IMAGE_WIDTH, IMAGE_HEIGHT))
        );
        setImages(resizedImages);

        // For preview
        const urls = resizedImages.map(img => URL.createObjectURL(img));
        setPreviewUrls(urls);
    };

    const createPost = async (e) => {
        e.preventDefault();
        if (!title || !content || !selectedCategory) {
            setError("Please fill in all fields.");
            return;
        }
        toast.success("Creating your post...");

        let formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category", selectedCategory.value);

        images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error("No token found in sessionStorage");
            }
            const response = await fetch(`${process.env.REACT_APP_API}/api/v1/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
                credentials: 'include',
            });

            if (response.status === 201) {
                toast.info("Your post is under review. Please wait until the admin approves it.");
                setTitle('');
                setContent('');
                setSelectedCategory(null);
                setImages([]);
                setPreviewUrls([]);
                setTimeout(() => {
                    navigate("/home");
                }, 5000);
            }
        } catch (error) {
            console.error('Error creating post:', error.message);
            setError(error.response?.data?.message || 'Something went wrong');
            toast.error(error.response?.data?.message || "Please try again");
        }
    };

    return (
        <div className="create-post-container">
            <h1 className="pleasant-title">Create Post</h1>
            <form onSubmit={createPost}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="pleasant-input"
                    />
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="pleasant-textarea"
                        rows={5}
                        style={{ fontSize: "1.1em", lineHeight: "1.6", padding: "12px" }}
                    />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <Select
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        options={categories}
                        placeholder="Select a Category"
                        className="pleasant-select"
                    />
                </div>
                <div className="form-group">
                    <label>Images</label>
                    <input type="file" multiple onChange={handleImageChange} />
                    <div className="image-preview">
                        {previewUrls.length > 0 ? (
                            previewUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="image-thumbnail"
                                    style={{ width: IMAGE_WIDTH / 3, height: IMAGE_HEIGHT / 3, objectFit: "cover", borderRadius: "10px", margin: "5px" }}
                                />
                            ))
                        ) : (
                            <p>Select Images</p>
                        )}
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="btn btn-primary pleasant-btn">Create Post</button>
            </form>
            <ToastContainer position="top-right" autoClose={6000} theme="colored" />
        </div>
    );
};

export default CreatePost;
