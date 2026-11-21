// import React, { useState } from 'react'
// import './AddProduct.css'
// import upload_area from '../../assets/upload_area.svg'

// const AddProduct = () => {

//     const [image,setImage] = useState(false);
//     const [productDetails,setProductDetails] = useState({
//         name:"",
//         image:"",
//         category:"women",
//         new_price:"",
//         old_price:""
//     })

//     const imageHandler = (e)=>{
//         setImage(e.target.files[0]);
//     }
//     const changeHandler = (e)=>{
//         setProductDetails({...productDetails,[e.target.name]:e.target.value })
//     }

//     const Add_Product = async ()=>{
//         console.log(productDetails);
//         let responseData;
//         let product = productDetails;

//         let formData = new FormData();
//         formData.append('product', image);

//         await fetch('https://ecommerce-us-node-full-stack-omun.vercel.app/upload',{ 
//             method: 'POST',
//             headers:{
//                 Accept :'application/json',
//             },
//             body:formData,
//         }).then((resp) => resp.json()).then((data)=>{responseData=data});

//         if(responseData.success){
//             product.image = responseData.image_url;
//             console.log(product);
//             await fetch('https://ecommerce-us-node-full-stack-omun.vercel.app/addproduct',{
//                 method:'POST',
//                 headers:{
//                     Accept:'application.json',
//                     'Content-Type':'application/json',
//                 },
//                 body:JSON.stringify(product),
//             }).then((resp)=>resp.json()).then((data)=>{
//                 data.success?alert("Product Added"):alert("Failed")
//             })
//         }
//     }

//   return (
//     <div className='add-product'> 
// <div className="addproduct-itemfield">
//     <p>Product title</p>
//     <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
// </div>
// <div className="addproduct-price">
//     <div className="addproduct-itemfield">
//         <p>Price</p>
//         <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
//     </div>
//     <div className="addproduct-itemfield">
//         <p>Offer Price</p>
//         <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
//         </div>
//     </div>
//     <div className="addproduct-itemfield">
//         <p>Product Category</p>
//         <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
//             <option value="women">Women</option>
//             <option value="men">Men</option>
//             <option value="kid">Kid</option>
//         </select>
//     </div>
//     <div className="addproduct-itemfield">
//         <label htmlFor="file-input"> 
//             <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' alt="" />
//         </label>
//         <input onChange={imageHandler} type="file" name='image' id='file-input' hidden/>
//     </div>
//     <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>
// </div>
//   )
// }

// export default AddProduct
// //<label htmlFor="file-input">  to choose file or somthing own computer





import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

    const backend_url = "https://ecommerce-us-node-full-stack-omun.vercel.app";

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: ""
    });

    const imageHandler = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImage(file);
        }
    };

    const changeHandler = (e) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value
        });
    };

    const Add_Product = async () => {

        if (!productDetails.name.trim()) {
            alert("Please enter product name");
            return;
        }

        if (!image) {
            alert("Please select product image");
            return;
        }

        if (!productDetails.old_price || !productDetails.new_price) {
            alert("Please enter product prices");
            return;
        }

        try {
            setLoading(true);

            // Image Upload
            const formData = new FormData();
            formData.append("product", image);

            const uploadResponse = await fetch(
                `${backend_url}/upload`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const responseData = await uploadResponse.json();

            if (!uploadResponse.ok || !responseData.success) {
                throw new Error(
                    responseData.message || "Image upload failed"
                );
            }

            // Add Product
            const product = {
                ...productDetails,
                image: responseData.image_url
            };

            const addResponse = await fetch(
                `${backend_url}/addproduct`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(product)
                }
            );

            const addData = await addResponse.json();

            if (!addResponse.ok || !addData.success) {
                throw new Error(
                    addData.message || "Product could not be added"
                );
            }

            alert("Product Added Successfully!");

            setProductDetails({
                name: "",
                image: "",
                category: "women",
                new_price: "",
                old_price: ""
            });

            setImage(null);

        } catch (error) {
            console.error("Add Product Error:", error);
            alert(error.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='add-product'>

            <div className="addproduct-itemfield">
                <p>Product title</p>

                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type="text"
                    name='name'
                    placeholder='Type here'
                />
            </div>

            <div className="addproduct-price">

                <div className="addproduct-itemfield">
                    <p>Price</p>

                    <input
                        value={productDetails.old_price}
                        onChange={changeHandler}
                        type="number"
                        name='old_price'
                        placeholder='Type here'
                    />
                </div>

                <div className="addproduct-itemfield">
                    <p>Offer Price</p>

                    <input
                        value={productDetails.new_price}
                        onChange={changeHandler}
                        type="number"
                        name='new_price'
                        placeholder='Type here'
                    />
                </div>

            </div>

            <div className="addproduct-itemfield">
                <p>Product Category</p>

                <select
                    value={productDetails.category}
                    onChange={changeHandler}
                    name="category"
                    className='add-product-selector'
                >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>

            <div className="addproduct-itemfield">

                <label htmlFor="file-input">
                    <img
                        src={
                            image
                                ? URL.createObjectURL(image)
                                : upload_area
                        }
                        className='addproduct-thumnail-img'
                        alt="Upload Product"
                    />
                </label>

                <input
                    onChange={imageHandler}
                    type="file"
                    name='image'
                    id='file-input'
                    accept="image/*"
                    hidden
                />

            </div>

            <button
                onClick={Add_Product}
                className='addproduct-btn'
                disabled={loading}
            >
                {loading ? "Uploading..." : "ADD"}
            </button>

        </div>
    );
};

export default AddProduct;
