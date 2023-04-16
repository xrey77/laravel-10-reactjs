<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;
use App\Models\Products;

class ProductsController extends Controller
{
    public function insertProduct(Request $request) {
        return response()->json("insert product");
    }

    public function updateProduct(Request $request) {
        return response()->json("update product");
    }

    public function listProducts(Request $request) {
        try {
            $prods = DB::table('products')->paginate(5);
            return response()->json($prods);

        } catch(\Exception $ex) {
            return response()->json(['statuscode' => 404, 'message' => $ex.getMessage()]);
        }
    }

    public function getProduct(Request $request) {
        return response()->json("get product");
    }

    public function deleteProduct(Request $request) {
        return response()->json("delete product");
    }



}
