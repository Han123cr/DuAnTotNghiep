import React, { useEffect, useState } from "react";

interface Product {
    menuItemID: number;
    itemName: string;
    description: string;
    price: string;
    image: string;
    menuID: number;
}

const ProductTable: React.FC = () => {
    const url = 'http://127.0.0.1:8000';
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                const response = await fetch(url+'/getMenuItems', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
                const data = await response.json();
                console.log(data);
                setProducts(data)
                
            }catch(err){
                console.error(err);
            }
        }
        fetchProducts();
    }, []);

    return (
        <table className="table table-hover table-bordered" id="sampleTable">
            <thead>
                <tr>
                    <th>STT</th>
                    <th>Mã sản phẩm</th>
                    <th style={{width: '12%'}}>Tên sản phẩm</th>
                    <th>Ảnh</th>
                    {/* <th>Số lượng</th> */}
                    {/* <th>Tình trạng</th> */}
                    <th>Giá tiền</th>
                    <th style={{width: '12%'}}>Danh mục</th>
                    <th style={{width: '12%'}}>Chức năng</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <tr key={product.menuItemID}>
                    <td>
                        {index + 1}
                    </td>
                    <td>{product.menuItemID}</td>
                    <td>{product.itemName}</td>
                    <td>
                        <img src={`/img/${product.image}`} alt="" width="100px;" />
                    </td>
                    {/* <td>{product.menuItemID}</td> */}
                    {/* <td>
                        <span className="badge bg-success">{product.status}</span>
                    </td> */}
                    <td>{product.price}</td>
                    <td>{product.menuID}</td>
                    <td>
                        <button style={{marginRight: '10px'}}
                            className="btn btn-primary btn-sm trash"
                            type="button"
                            title="Xóa"
                        >
                            <i className="fas fa-trash-alt" />
                        </button>
                        <button
                            className="btn btn-primary btn-sm edit"
                            type="button"
                            title="Sửa"
                            id="show-emp"
                            data-toggle="modal"
                            data-target="#ModalUP"
                        >
                            <i className="fas fa-edit" />
                        </button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    )
};

export default ProductTable;
