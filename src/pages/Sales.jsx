import { useEffect, useState } from "react";
import products from "../db.json";
import MainLayout from "../layouts/MainLayout";

function Sales() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchProducts = () => {
    setIsLoading(true);
    setData(products);
    setIsLoading(false);
  };
  console.log(data?.products);
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <MainLayout>
      <div className="row">
        <div className="col-lg-8">
          {isLoading ? (
            "Loading"
          ) : (
            <div className="row">
              {data?.products &&
                data?.products?.map((product, key) => (
                  <div key={key} className="col-lg-4 mb-4">
                    <div className="pos-item px-3 text-center border">
                      <p>{product.name}</p>
                      <img
                        src={product.image}
                        className="img-fluid"
                        alt={product.name}
                      />
                      <p>${product.price}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Sales;
