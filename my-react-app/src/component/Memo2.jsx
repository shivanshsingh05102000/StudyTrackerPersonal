import React, { useMemo, useState } from 'react'

export default function Memo2() {
    const [count, setCount] = useState(0);
    const [input, setInput] = useState(0);

    function handelInp(e) {
        setInput(e.target.value);
    }
    let ans = useMemo(() => {
        let sum = 0;
        for (let i = 1; i <= input; i++) {
            sum += i;
            console.log("loop")
        }
        return sum;
    }, [input])
    return (
        <div>
            <input onChange={handelInp} type="text" value={input} />
            <h1>Sum : {ans}</h1>
            <button onClick={() => setCount(count + 1)}>Cout : {count}</button>
        </div>
    )
}
