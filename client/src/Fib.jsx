import axios from "axios";
import React, { useState, useEffect } from "react";

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const fetchValues = async () => {
    const { data } = await axios.get("/api/values/current");
    //setValues({values: data});
    setValues(data);
  };

  const fetchIndexes = async () => {
    const { data } = await axios.get("/api/values/all");
    //setSeenIndexes({
    //     seenIndexes: data
    //    });
    setSeenIndexes(data);
  };

  const renderSeenIndexes = () => {
    // if(seenIndexes && seenIndexes.seenIndexes && seenIndexes.seenIndexes.length)
    //     return seenIndexes.seenIndexes.map(el => el.number).join(', ');
    // return (<div> No calculation stored. </div>)
    if (Array.isArray(seenIndexes) && seenIndexes.length > 0)
      return seenIndexes.map((el) => el.number).join(", ");
    return <div>No calculation stored.</div>;
  };

  const renderCalculatedValues = () => {
    // const entries = [];

    // if(values && values.values) {
    //     for(let key in values.values) {
    //         entries.push(
    //             <div key={key}>
    //                 For index {key} I calculated {values.values[key]}
    //             </div>
    //         )
    //     }

    //     return entries;
    // }

    // return (<div> No calculation stored.</div>)

    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries.length ? entries : <div>No calculation stored.</div>;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("/api/values", {
      index,
    });

    setIndex("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter your index: </label>
        <input
          type="number"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
        ></input>
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen </h3>
      {renderSeenIndexes()}

      <h3> Calculated Values: </h3>
      {renderCalculatedValues()}
    </div>
  );
};

export default Fib;
