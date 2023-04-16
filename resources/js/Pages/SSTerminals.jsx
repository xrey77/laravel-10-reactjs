import React,{useEffect, useState} from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'inherit'},
})

export default function SSTerminals() {

        const [totalpage, setTotalpage] = useState(null);
        const [nextpage, setNextpage] = useState(null);
        const [prevpage, setPrevpage] = useState(null);
        const [products, setProducts] = useState([]);
        const [page, setPage] = useState(null);
        // var url = "http://127.0.0.1:8000/api/v2/listproducts?page=";
        // var pagesArray = [];
        // for (var i = 0; i < this.props.pages; i++) {
        //     pagesArray.push(<li className="page-item"><a className="page-link" href="#">{i}</a></li>);
        // }

        useEffect(() => {
            const fetchdata = async () => {
                // api.get("/api/v2/listproducts",{headers: {
                //     Authorization: `Bearer ${token}`
                
                await api.get("/api/v2/listproducts?page=1")
                .then(res => {
                    setTotalpage(res.data.last_page);
                    setNextpage(res.data.next_page_url);
                    // setPrevpage(res.data.prev_page_url);
                    setProducts(res.data.data);
                    setPage(res.data.current_page);
                }, (error) => {
                    console.log(error);
                    return;
                });                                                    
            }
            fetchdata();
        },[]);


    const firstPage = async () => {
        await api.get("/api/v2/listproducts?page=1")
        .then(res => {
            setTotalpage(res.data.last_page);
            setNextpage(res.data.next_page_url);
            setProducts(res.data.data);
            setPage(res.data.current_page);
        }, (error) => {
            console.log(error);
            return;
        });                                                    

    }

    const lastPage = async () => {
        await api.get("/api/v2/listproducts?page=" + totalpage)
        .then(res => {
            setTotalpage(res.data.last_page);
            setNextpage(res.data.next_page_url);
            setProducts(res.data.data);
            setPage(res.data.current_page);
        }, (error) => {
            console.log(error);
            return;
        });                                                    

    }


    const newxPage = async () => {
        await api.get(nextpage)
        .then(res => {
            if (nextpage) {
              setNextpage(res.data.next_page_url);
              setPage(res.data.current_page);
            } else {                
                window.history.back();
                return;
            }
            setPrevpage(res.data.prev_page_url);
            setProducts(res.data.data);
        }, (error) => {
            console.log(error);
            return false;
        });                
    }        

    const prevPage = async () => {
        await api.get(prevpage)
        .then(res => {
            setNextpage(res.data.next_page_url);
            if (prevpage) {
                setNextpage(res.data.next_page_url);
                setPrevpage(res.data.prev_page_url);
                setPage(res.data.current_page);
            } else {
                window.history.forward(2);
                return false;
            }
            setProducts(res.data.data);
        }, (error) => {
            console.log(error);
            return;
        });                

    }        


    return (
        <div className="container">
            <h1 className="text-center">Self Service Terminals</h1>
            <div className="text-center">Products List</div>

            <table className="table">
                <thead>
                    <tr className="table-dark">
                    <th scope="col">#</th>
                    <th scope="col">Descriptions</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Unit</th>
                    <th scope="col">Price</th>
                    </tr>
                </thead>
                <tbody>
                {products.map((prods) => {
                    return (
                            <tr>
                            <td>{prods.id}</td>
                            <td>{prods.descriptions}</td>
                            <td>{prods.qty}</td>
                            <td>{prods.unit}</td>
                            <td>{prods.sell_price}</td>
                            </tr>
                    );
                })}

                </tbody>
                
            </table>
    
            <div className="products">
            <nav aria-label="Page navigation">
                <ul className="pagination pagination-sm">
                    <li id="first" className="page-item"><a onClick={firstPage} className="page-link" href="#">First</a></li>

                    <li id="prev" className="page-item"><a onClick={prevPage} className="page-link" href="#">Previous</a></li>
                    <li className="page-item"><a className="page-link" href="#">{page}&nbsp;of&nbsp;{totalpage}</a></li>
                    {/* <li className="page-item"><a className="page-link" href="#">1</a></li>
                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li> */}
                    <li id="next" className="page-item"><a onClick={newxPage} className="page-link" href="#">Next</a></li>
                    <li id="last" className="page-item"><a onClick={lastPage} className="page-link" href="#">Last</a></li>

                </ul>
            </nav>
            <span>Total Page : {totalpage}</span>
            </div>
        </div>
    )
}
