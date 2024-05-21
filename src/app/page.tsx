"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingred, setIngred] = useState<string>('');
  const [modal, setModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number>(0);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) : void {
    if (e.key === 'Enter') {
      if (ingred != '' || ingred != null || ingred != undefined){
        setIngredients([...ingredients, ingred]);
        setIngred('');
      } 
    }
  }

  function deleteItem(index: number) {
    setIngredients(ingredients.filter((_, idx) => {
      return (idx !== index);
    }));
  }

  return (
    <main className='flex justify-center p-24 grid'>
      <header>
        <h1 className='text-3xl font-bold p-4 m-5 justify-center'>
          What's in the fridge?
        </h1>
      </header>


      <div className='p-2 m-2 text-center w-100'>
        <h3 className='text-2l font-bold m-3'>
          Add your items here.
        </h3>
        <input className='rounded cursor-text focus:outline-none border-2 border-black' type="text" value={ingred} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIngred(e.target.value)} onKeyDown={handleKeyDown} />
      </div>

      <div className='p-2 m-2 text-center'>
        {(ingredients.length > 0) && (
          <Link href={{
            pathname: '/results/',
            query: {ingredients: ingredients.join(',')}
          }}>
            <button className='p-2 m-2 text-center rounded border-2 border-black'>Look for Recipes</button>
          </Link>
          )
        }
      </div>


      <div>
        <ul className='position-relative grid grid-cols-1 gap-4'>
          {ingredients.map((ingredient, index) => 
            <div key={index} className='h-full w-full bg-purple-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-50 border border-transparent'>
              <li className='float-left p-2 fontfamily-manrope' key={index}>{ingredient}</li>
              <button className='float-right p-2' onClick={() =>{setModal(true);setSelectedItem(index)}}>Remove</button>
            </div>)}
        </ul>
      </div>
      
      {modal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <p>Are you sure you want to delete the item?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 mr-2 rounded"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() =>{
                  deleteItem(selectedItem);
                  setModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
