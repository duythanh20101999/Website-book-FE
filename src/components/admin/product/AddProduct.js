import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { numberFormat } from '../../../configs/constants';

function AddProduct() {
    const [categorylist, setCategorylist] = useState([]);
    const [productInput, setProduct] = useState({
        id_category: '',
        authorname: '',
        name: '',
        description: '',
        price: '',
    });
    const [picture, setPicture] = useState([]);
    const [errorlist, setError] = useState([]);

    const handleInput = (e) => {
        e.persist();
        setProduct({ ...productInput, [e.target.name]: e.target.value });
    }

    const handleImage = (e) => {
        setPicture({ img: e.target.files[0] });
    }

    useEffect(() => {
        let isMounted = true;

        axios.get(`/api/category`).then(res => {
            if (isMounted) {
                if (res.data.success === true) {
                    setCategorylist(res.data.datas);
                }
            }
        });

        return () => {
            isMounted = false
        };

    }, []);

    const submitProduct = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id_category', productInput.id_category);
        formData.append('name', productInput.name);
        formData.append('authorname', productInput.authorname);
        formData.append('price', productInput.price);
        formData.append('description', productInput.description);
        formData.append('img', picture.image);

        axios.post(`/api/admin/insert_book`, formData).then(res => {
            if (res.data.success === true) {
                swal("Success", res.data.message, "success");
                setProduct({
                    ...productInput,
                    id_category: '',
                    name: '',
                    description: '',
                    authorname: '',
                    price: '',
                    image: '',
                });
                setError([]);
            }
            // else if(res.data.status === 422)
            // {
            //     swal("All Fields are mandetory","","error");
            //     setError(res.data.errors);
            // }
        }).catch((err) => console.log(err));

    }

    return (
        <div className="container-fluid px-4">
            <div className="card mt-4">
                <div className="card-header">
                    <h4>Th??m s??ch
                        <Link to="/admin/view-product" className="btn btn-primary btn-sm float-end">Xem s???n ph???m</Link>
                    </h4>
                </div>
                <div className="card-body">
                    <form onSubmit={submitProduct} encType="multipart/form-data">
                        <div className="tab-content" id="myTabContent">
                            <div className="form-group mb-3">
                                <label>Ch???n th??? lo???i</label>
                                <select name="id_category" onChange={handleInput} value={productInput.id_category} className="form-control">
                                    {
                                        categorylist.map((item) => {
                                            return (
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                                <small className="text-danger">{errorlist.id_category}</small>
                            </div>
                            <div className="form-group mb-3">
                                <label>T??n s??ch</label>
                                <input type="text" name="name" onChange={handleInput} value={productInput.name} className="form-control" required/>
                                <small className="text-danger">{errorlist.name}</small>
                            </div>
                            <div className="form-group mb-3">
                                <label>M?? t???</label>
                                <textarea name="description" onChange={handleInput} value={productInput.description} className="form-control" required></textarea>
                            </div>
                            <div className="form-group mb-3">
                                <label>T??c gi???</label>
                                <input name="authorname" onChange={handleInput} value={productInput.authorname} className="form-control" required></input>
                            </div>
                            <div className="form-group mb-3">
                                <label>Gi?? (?????nh d???ng: {numberFormat(productInput.price)})</label>
                                <input name="price" type="number" onChange={handleInput} value={productInput.price} className="form-control" required></input>
                            </div>
                            <div className="form-group mb-3">
                                <label>H??nh ???nh</label>
                                <input type="file" name="img" onChange={handleImage} className="form-control" required/>
                            </div>
                        
                        </div>
                        <button type="submit" className="btn btn-primary px-4 mt-2">Submit</button>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProduct;
