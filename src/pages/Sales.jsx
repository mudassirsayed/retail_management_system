import { useEffect, useRef, useState } from "react";
import products from "../db.json";
import MainLayout from "../layouts/MainLayout";
import { toast } from "react-toastify";
import { ComponentToPrint } from "../components/ComponentToPrint";
import { useReactToPrint } from "react-to-print";

function Sales() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const inputImageRef = useRef(null);

  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  };

  const fetchProducts = () => {
    setIsLoading(true);
    //added loader to fetch products from an api in future
    setData(products?.products);
    setIsLoading(false);
  };

  const addProductToCart = async (product) => {
    // check if the adding product exist
    let findProductInCart = await cart.find((i) => {
      return i.id === product.id;
    });

    if (findProductInCart) {
      let newCart = [];
      let newItem;

      cart.forEach((cartItem) => {
        if (cartItem.id === product.id) {
          newItem = {
            ...cartItem,
            quantity: cartItem.quantity + 1,
            totalAmount: cartItem.price * (cartItem.quantity + 1),
          };
          newCart.push(newItem);
        } else {
          newCart.push(cartItem);
        }
      });

      setCart(newCart);
      toast(`Added ${newItem.name} to cart`, toastOptions);
    } else {
      let addingProduct = {
        ...product,
        quantity: 1,
        totalAmount: product.price,
      };
      setCart([...cart, addingProduct]);
      toast(`Added ${product.name} to cart`, toastOptions);
    }
  };

  const removeProduct = async (product) => {
    const newCart = cart.filter((cartItem) => cartItem.id !== product.id);
    setCart(newCart);
  };

  const componentRef = useRef();

  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handleReactToPrint();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let newTotalAmount = 0;
    cart.forEach((icart) => {
      newTotalAmount = newTotalAmount + parseInt(icart.totalAmount);
    });
    setTotalAmount(newTotalAmount);
  }, [cart]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredProducts = data?.filter((prod) => {
    return prod.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddNewTask = () => {
    setData([
      ...data,
      {
        id: Date.now(),
        name: newName,
        image: imageUrl ? imageUrl : newImage,
        price: newPrice,
      },
    ]);

    // Empty the value of the Textbox
    setNewName("");
    setNewImage("");
    inputImageRef.current.value = "";
    setNewPrice("");
  };

  const handleImage = (e) => {
    const fileImage = e.target.files[0];
    setNewImage(fileImage);
  };

  const imageUrl = newImage ? URL.createObjectURL(newImage) : null;

  const deleteProduct = (product) => {
    const removePro = data?.filter((a) => a.id !== product.id);
    if (removePro) {
      alert("Are you sure you want to delete a product?");
      setData(removePro);
    }
  };

  return (
    <MainLayout>
      <div className="row">
        <div className="col-lg-8">
          <div className="input-group d-flex justify-content-center">
            <div className="form-outline">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="form-control my-search-input"
              />
            </div>
          </div>
          <div className="row">
            {filteredProducts && filteredProducts.length > 0
              ? filteredProducts?.map((product, key) => (
                  <div key={key} className="col-lg-4 mb-4">
                    <div
                      className="sales-item px-3 text-center border"
                      onClick={() => addProductToCart(product)}
                    >
                      <p>{product.name}</p>
                      <img
                        src={product.image}
                        className="img-fluid"
                        alt={product.name}
                      />
                      <p>${product.price}</p>
                    </div>
                    <div className="d-flex justify-content-center m-2">
                      <button
                        className="bg-danger text-light"
                        onClick={() => deleteProduct(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              : !isLoading && (
                  <h1
                    className="d-flex justify-content-center align-items-center text-danger"
                    style={{ minHeight: "50vh" }}
                  >
                    No Data Found
                  </h1>
                )}
          </div>
        </div>
        <div className="col-lg-4">
          <div style={{ display: "none" }}>
            <ComponentToPrint
              cart={cart}
              totalAmount={totalAmount}
              ref={componentRef}
            />
          </div>
          <div className="table-responsive bg-dark">
            <table className="table table-responsive table-dark table-hover">
              <thead>
                <tr>
                  <td>#</td>
                  <td>Name</td>
                  <td>Price</td>
                  <td>Qty</td>
                  <td>Total</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {cart.length > 0 ? (
                  cart?.map((cartProduct, key) => (
                    <tr key={key}>
                      <td>{cartProduct.id}</td>
                      <td>{cartProduct.name}</td>
                      <td>{cartProduct.price}</td>
                      <td>{cartProduct.quantity}</td>
                      <td>{cartProduct.totalAmount}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeProduct(cartProduct)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <p>No Item in Cart</p>
                )}
              </tbody>
            </table>
            <h2 className="px-2 text-white">Total Amount: ${totalAmount}</h2>
          </div>

          <div className="mt-3">
            {totalAmount !== 0 ? (
              <div>
                <button className="btn btn-primary" onClick={handlePrint}>
                  Pay Now
                </button>
              </div>
            ) : (
              "Please add a product to the cart"
            )}
          </div>
          <div className="row mt-3">
            <div className="col-lg-12">
              <input
                className="form-control mt-3"
                type="text"
                placeholder="Enter the product name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <input
                className="form-control mt-3"
                type="file"
                accept="image/*"
                onChange={handleImage}
                ref={inputImageRef}
              />
              {imageUrl && <img src={imageUrl} alt="Selected file" />}
              <input
                className="form-control mt-3"
                type="number"
                placeholder="Enter the product price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
            <div className="col-lg-4 mt-3">
              <button onClick={handleAddNewTask} className="btn btn-primary">
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Sales;
