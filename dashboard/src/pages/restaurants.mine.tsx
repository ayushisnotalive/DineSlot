import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

interface Restaurant {
    id:string,
    name:string,
    address:string,
    created_at:string
}


export default function Restaunrant(){
    const {accessToken} = useAuth();
    const [ restaurants , setRestaurants] = useState<Restaurant[]>([]);
    const [loading , setLoading] = useState(true);
    const [ error , setError] = useState("");



    // create state form
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [creating, setCreating] = useState(false);


    const fetchRestaurant = async()=>{
        try{    

            const res = await api.get("/restaurants/mine",{
                headers:{Authorization: `Bearer ${accessToken}`}
            });

            setRestaurants(res.data.restaurants)


        }
        catch(e){
            setError("Failed to load restaurants")
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchRestaurant()
    },[accessToken])

    const handleCreate = async(e: React.FormEvent)=>{
        e.preventDefault();
        setCreating(true)
        try{
            await api.post(
                "/restaurant/createRestaurant",
                {name,address},
                {headers:{Authorization:`Bearer ${accessToken}`}}
            );
            setName("");
            setAddress("");
            fetchRestaurant(); //will refresh the whole list


        }catch(e){
            setError("faile to create restaurant")
        }finally{
            setCreating(false)
        }
    }
    if(loading) return <div>loading...</div>

    return(
        <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-serif mb-6">My Restaurants</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleCreate} className="mb-8 space-y-3 bg-gray-50 p-6 rounded-lg">
        <input
          type="text"
          placeholder="Restaurant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border border-gray-200"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-200"
        />
        <button
          type="submit"
          disabled={creating}
          className="bg-[var(--color-terracotta-600)] text-white px-4 py-2 rounded"
        >
          {creating ? "Creating..." : "Add Restaurant"}
        </button>
      </form>

      <div className="space-y-3">
        {restaurants.length === 0 && <p>No restaurants yet.</p>}
        {restaurants.map((r) => (
          <div key={r.id} className="p-4 border border-gray-200 rounded-lg">
            <h2 className="font-medium">{r.name}</h2>
            <p className="text-gray-500 text-sm">{r.address}</p>
          </div>
        ))}
      </div>
    </div>
    );


}