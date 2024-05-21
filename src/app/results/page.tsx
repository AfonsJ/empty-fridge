'use client';
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Redirect = (idobj : any) => {
    const id  = idobj.id;

    const router = useRouter();
 
    function getRecipeLink(id:number) {
        axios.get("https://api.spoonacular.com/recipes/"+id.toString()+"/information", {
            params: {
                id: id,
            },
            headers:{
                'x-api-key': process.env.NEXT_PUBLIC_KEY
            }
        })
        .then((res) => {
            if(res.status == 200){
                router.push(res.data.sourceUrl);
            }else{
                console.log("unable to retrieve link");
                router.push("/error/");
            }
        })
        .catch((err)=>{
            console.log(err);   
            router.push("/error/");
        });
    }

    const handleClick = () => {
        getRecipeLink(id);
    }

    return (
        <button onClick={handleClick} className="p-2 m-2 text-center text-blue-800">
            Get Recipe Link
        </button>
    )
}

const Table = ({data}:any) => {
    const [page, setPage] = useState<number>(1);

    const totalPages = Math.ceil(data.length / 15);
    const paginatedData = data.slice((page-1)*15, page*15);

    return (
        <div className="border outline outline-1 outline-black-100 overflow-hidden border-collapse border-radius-md rounded">
            <table className="p-4 m-5 relative w-full">
                <thead className="boarder-radius-md border-gray-400">
                    <tr>
                        <th className="p-4 w-1/3">Name</th>
                        <th className="p-4 w-1/3">Missing Ingredients</th>
                        <th className="p-4 w-1/3">Link</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((recipe:any, index:number) => (
                        <tr key={index}>
                            <td className="p-4 w-1/3">{recipe.title}</td>
                            <td className="p-4 w-1/3 text-center relative group">
                                {recipe.missedIngredientCount}
                                <span className="absolute top-4 left-20 hidden group-hover:block bg-gray-100 p-2 rounded shadow-lgx">
                                    {recipe.missedIngredients.map((ing:any) => ing.name).join(', ')}
                                </span>    
                            </td>   
                            <td className="p-4 w-1/3 text-center"><Redirect id={recipe.id} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center space-x-4">
                <button disabled={page == 1} onClick={()=>{setPage(page - 1)}} className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed">Previous</button>
                <span className="text-lg m-1">{page}/{totalPages}</span>
                <button disabled={page == totalPages} onClick={()=>{setPage(page + 1)}} className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed">Next</button>
            </div>
        </div>

    )
}

export default function Results(ingredients:string[]) {
    const searchParams = useSearchParams();
    const ingres = searchParams.get('ingredients');
    const [results, setResults] = useState([]);

    const router = useRouter();

    function getRecipes(ingredients:string) {

        axios.get("https://api.spoonacular.com/recipes/findByIngredients", {
            params: {
                ingredients: ingredients,
                number : 40,
                ranking: 2,
                ignorePantry: true
            },
            headers:{
                'x-api-key': process.env.NEXT_PUBLIC_KEY
            }
        })
        .then((res) => {
            if(res.status == 200){
                const results = res.data;
                
                setResults(results);
            }else{
                setResults([]);
            }

        })
        .catch((err)=>{
            console.log(err);
        });
    }

    useEffect(() => {
        if(ingres != null){
            getRecipes(ingres);
        }
    },[]);



    return (
        <div className="flex justify-center p-24 grid">
            {(results.length != 0)&& (<Table data={results}/>)}
            {(results.length == 0)&& (
                <div className="flex justify-center grid">
                    <p className="text-3xl font-bold p-4 m-5 justify-center">No results found</p>
                    <div className="flex justify-center">   
                        <button className="rounded bg-100 bg-blue-500 p-2 text-black hover:bg-blue-700 w-1/3" onClick={() => router.back()}>Go Back</button>
                    </div>
                </div>
            )}
        </div>
    )

}