import Header from '../Header/header';
import { useParams } from 'react-router-dom';
import "./UpdateProduct.css";

function UpdateProduct () {
    const { id } = useParams(); 
    const [data, setData] = useState([])
    const [product_name, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [product_price, setProductPrice] = useState("");  
    const [file_path, setFile] = useState("");

    useEffect(() => {
        async function fetchData() {
            let result = await fetch("http://localhost:8000/api/getProductById/" + id);
            result = await result.json();
            setData(result);
            setProductName(result.product_name);
            setDescription(result.description);
            setProductPrice(result.product_price);
            setFile(result.file_path);
        }
        fetchData();
    },[id]);

    async function UpdateProduct(id) {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("product_name", product_name);
        formData.append("description", description);
        formData.append("product_price", product_price);
        formData.append("file_path", file_path);
        let result =  await fetch("http://localhost:8000/api/updateProduct/"+ id +"?_method=PUT", {
            method: "POST",
            body: formData
        });
        alert("Product Updated");
    }
    return (
        <div>
            <Header />
         <div  className="update-product-container">   
            <h1>Update Product Page</h1>
            <input type="text" 
             onChange={(e)=> setProductName(e.target.value)}
             defaultValue={data.product_name} /> <br />  <br />
            <input type="text"  
             onChange={(e)=> setDescription(e.target.value)}  
             defaultValue={data.description} /> <br />  <br />
            <input type="text"   
             onChange={(e)=> setProductPrice(e.target.value)} 
             defaultValue={data.product_price} /> <br />  <br />
            <input type="file"  
            onChange={(e)=> setFile(e.target.files[0])}
             defaultValue={data.file_path}/> <br />  <br />
            <img style={{ width: 100 }} src={"http://localhost:8000/" + data.file_path} /> <br />  <br />
            
            <button onClick={() => (UpdateProduct(data.id))} >Update Product</button>
        </div>
        </div>           
        );
}

export default UpdateProduct;