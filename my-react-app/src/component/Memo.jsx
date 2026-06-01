import React, { useState , memo } from 'react'

export default function Memo({name}){
    const [user,setUser] = useState(name);
    function handelChange(){
        setUser((Math.floor(Math.random()*10)));
    }
    return(
    <div>
        <Chotu data={user}/>
        <button onClick={handelChange}>Click me</button>
        <Chotu data="Sam"/>
        <Chotu data="Mav"/>
        <Chotu2 data="dev"/>
    </div>
)}

const Chotu2 = memo(Chotu);

function Chotu({data}){
    return(
        <div>
            <h1>Hello from : {data}</h1>
        </div>
    )
}